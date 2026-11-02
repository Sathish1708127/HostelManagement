<?php
namespace App\Repositories;

use App\Config\Database;
use App\Support\HttpException;
use PDO;

final class ResidentRepository
{
    public static function paginate(string $search, string $nationality, int $page, int $perPage): array
    {
        $where = ['student_profiles.deleted_at IS NULL'];
        $parameters = [];

        if ($search !== '') {
            $where[] = '(student_profiles.legal_name LIKE :search
                OR student_profiles.university_id LIKE :search
                OR rooms.room_number LIKE :search)';
            $parameters['search'] = '%' . $search . '%';
        }
        if ($nationality !== '') {
            $where[] = 'student_profiles.nationality = :nationality';
            $parameters['nationality'] = $nationality;
        }

        $filter = implode(' AND ', $where);
        $pdo = Database::connection();
        $count = $pdo->prepare(
            "SELECT COUNT(*)
             FROM student_profiles
             LEFT JOIN bed_assignments ON bed_assignments.student_profile_id = student_profiles.id
                 AND bed_assignments.ends_at IS NULL
             LEFT JOIN beds ON beds.id = bed_assignments.bed_id
             LEFT JOIN rooms ON rooms.id = beds.room_id
             WHERE {$filter}"
        );
        $count->execute($parameters);
        $total = (int) $count->fetchColumn();

        $offset = ($page - 1) * $perPage;
        $query = $pdo->prepare(
            "SELECT student_profiles.uuid, student_profiles.university_id,
                    student_profiles.legal_name, student_profiles.preferred_name,
                    student_profiles.nationality, student_profiles.course,
                    student_profiles.semester, student_profiles.status,
                    student_profiles.profile_completion, rooms.room_number,
                    beds.bed_number
             FROM student_profiles
             LEFT JOIN bed_assignments ON bed_assignments.student_profile_id = student_profiles.id
                 AND bed_assignments.ends_at IS NULL
             LEFT JOIN beds ON beds.id = bed_assignments.bed_id
             LEFT JOIN rooms ON rooms.id = beds.room_id
             WHERE {$filter}
             ORDER BY student_profiles.legal_name
             LIMIT :limit OFFSET :offset"
        );
        foreach ($parameters as $key => $value) {
            $query->bindValue(':' . $key, $value);
        }
        $query->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $query->bindValue(':offset', $offset, PDO::PARAM_INT);
        $query->execute();

        return [
            'items' => $query->fetchAll(),
            'meta' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => (int) ceil($total / $perPage),
            ],
        ];
    }

    public static function create(array $data): array
    {
        $pdo = Database::connection();
        $user = $pdo->prepare('SELECT id FROM users WHERE email = :email AND deleted_at IS NULL');
        $user->execute(['email' => $data['email']]);
        $userId = $user->fetchColumn();
        if (!$userId) {
            throw new HttpException(
                'The resident must register with Supabase before a hostel profile can be created.',
                409
            );
        }

        $hostel = $pdo->prepare('SELECT id FROM hostels WHERE uuid = :uuid AND status = "active"');
        $hostel->execute(['uuid' => $data['hostel_uuid']]);
        $hostelId = $hostel->fetchColumn();
        if (!$hostelId) {
            throw new HttpException('Hostel not found.', 404);
        }

        $statement = $pdo->prepare(
            'INSERT INTO student_profiles
                (user_id, hostel_id, uuid, university_id, legal_name, preferred_name,
                 nationality, course, semester, phone, admission_date, status, profile_completion)
             VALUES
                (:user_id, :hostel_id, UUID(), :university_id, :legal_name, :preferred_name,
                 :nationality, :course, :semester, :phone, :admission_date, "approved", 55)'
        );
        $statement->execute([
            'user_id' => $userId,
            'hostel_id' => $hostelId,
            'university_id' => $data['university_id'],
            'legal_name' => $data['legal_name'],
            'preferred_name' => $data['preferred_name'] ?: null,
            'nationality' => $data['nationality'],
            'course' => $data['course'] ?: null,
            'semester' => $data['semester'] ?: null,
            'phone' => $data['phone'] ?: null,
            'admission_date' => $data['admission_date'] ?: null,
        ]);

        $id = (int) $pdo->lastInsertId();
        $result = $pdo->prepare('SELECT * FROM student_profiles WHERE id = :id');
        $result->execute(['id' => $id]);
        return $result->fetch() ?: [];
    }
}
