<?php
namespace App\Services;

use App\Config\Database;
use App\Support\HttpException;
use PDOException;

final class BedAssignmentService
{
    public static function assign(string $studentUuid, string $bedUuid, int $assignedBy, ?string $notes): array
    {
        $pdo = Database::connection();
        $pdo->beginTransaction();
        try {
            $student = $pdo->prepare(
                'SELECT id, status FROM student_profiles
                 WHERE uuid = :uuid AND deleted_at IS NULL FOR UPDATE'
            );
            $student->execute(['uuid' => $studentUuid]);
            $studentRow = $student->fetch();
            if (!$studentRow) {
                throw new HttpException('Resident not found.', 404);
            }

            $bed = $pdo->prepare(
                'SELECT beds.id, beds.status, rooms.gender_policy
                 FROM beds JOIN rooms ON rooms.id = beds.room_id
                 WHERE beds.uuid = :uuid AND rooms.deleted_at IS NULL FOR UPDATE'
            );
            $bed->execute(['uuid' => $bedUuid]);
            $bedRow = $bed->fetch();
            if (!$bedRow) {
                throw new HttpException('Bed not found.', 404);
            }
            if ($bedRow['status'] !== 'available') {
                throw new HttpException('This bed is not available for assignment.', 409);
            }

            $assignment = $pdo->prepare(
                'INSERT INTO bed_assignments
                    (uuid, student_profile_id, bed_id, assigned_by, starts_at, notes)
                 VALUES (UUID(), :student_id, :bed_id, :assigned_by, NOW(), :notes)'
            );
            $assignment->execute([
                'student_id' => $studentRow['id'],
                'bed_id' => $bedRow['id'],
                'assigned_by' => $assignedBy,
                'notes' => $notes,
            ]);
            $pdo->prepare("UPDATE beds SET status = 'occupied' WHERE id = :id")
                ->execute(['id' => $bedRow['id']]);
            $pdo->prepare(
                "UPDATE student_profiles SET status = 'checked_in' WHERE id = :id"
            )->execute(['id' => $studentRow['id']]);

            $id = (int) $pdo->lastInsertId();
            $result = $pdo->prepare('SELECT uuid, starts_at, notes FROM bed_assignments WHERE id = :id');
            $result->execute(['id' => $id]);
            $pdo->commit();
            return $result->fetch() ?: [];
        } catch (PDOException $exception) {
            $pdo->rollBack();
            if ((int) $exception->errorInfo[1] === 1062) {
                throw new HttpException('The resident or bed already has an active assignment.', 409);
            }
            throw $exception;
        } catch (\Throwable $exception) {
            $pdo->rollBack();
            throw $exception;
        }
    }
}
