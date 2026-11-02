<?php

namespace App\Support;

class OpenApiDocumentation
{
    public static function getSpec(): array
    {
        return [
            'openapi' => '3.0.0',
            'info' => [
                'title' => 'Hostel Management System API',
                'description' => 'Comprehensive REST API for managing hostel operations',
                'version' => '1.0.0',
                'contact' => [
                    'name' => 'API Support',
                    'email' => 'api@hostel.local',
                ],
            ],
            'servers' => [
                ['url' => $_ENV['API_BASE_URL'] ?? 'http://localhost:8000', 'description' => 'API Server'],
            ],
            'paths' => self::getPaths(),
            'components' => self::getComponents(),
            'tags' => self::getTags(),
            'info' => [
                'x-logo' => ['url' => 'https://hostel.local/logo.png'],
            ],
        ];
    }

    private static function getPaths(): array
    {
        return [
            '/api/v1/guardians' => [
                'get' => [
                    'tags' => ['Guardians'],
                    'summary' => 'List all guardians',
                    'parameters' => self::getPaginationParams(),
                    'security' => [['bearerAuth' => []]],
                    'responses' => [
                        '200' => ['description' => 'Success', 'content' => ['application/json' => []]],
                        '401' => ['description' => 'Unauthorized'],
                    ],
                ],
                'post' => [
                    'tags' => ['Guardians'],
                    'summary' => 'Create new guardian',
                    'security' => [['bearerAuth' => []]],
                    'requestBody' => self::getGuardianRequestBody(),
                    'responses' => [
                        '201' => ['description' => 'Created'],
                        '400' => ['description' => 'Validation Error'],
                    ],
                ],
            ],
            '/api/v1/complaints' => [
                'get' => [
                    'tags' => ['Complaints'],
                    'summary' => 'List complaints',
                    'parameters' => self::getPaginationParams(),
                    'security' => [['bearerAuth' => []]],
                    'responses' => ['200' => ['description' => 'Success']],
                ],
                'post' => [
                    'tags' => ['Complaints'],
                    'summary' => 'Submit new complaint',
                    'security' => [['bearerAuth' => []]],
                    'requestBody' => self::getComplaintRequestBody(),
                    'responses' => ['201' => ['description' => 'Created']],
                ],
            ],
            '/api/v1/fees' => [
                'get' => [
                    'tags' => ['Finances'],
                    'summary' => 'List fee structures',
                    'parameters' => self::getPaginationParams(),
                    'security' => [['bearerAuth' => []]],
                    'responses' => ['200' => ['description' => 'Success']],
                ],
            ],
            '/api/v1/leaves' => [
                'get' => [
                    'tags' => ['Leaves'],
                    'summary' => 'List leave requests',
                    'parameters' => self::getPaginationParams(),
                    'security' => [['bearerAuth' => []]],
                    'responses' => ['200' => ['description' => 'Success']],
                ],
                'post' => [
                    'tags' => ['Leaves'],
                    'summary' => 'Apply for leave',
                    'security' => [['bearerAuth' => []]],
                    'requestBody' => self::getLeaveRequestBody(),
                    'responses' => ['201' => ['description' => 'Created']],
                ],
            ],
            '/api/v1/attendance' => [
                'post' => [
                    'tags' => ['Attendance'],
                    'summary' => 'Record attendance',
                    'security' => [['bearerAuth' => []]],
                    'requestBody' => self::getAttendanceRequestBody(),
                    'responses' => ['201' => ['description' => 'Created']],
                ],
            ],
        ];
    }

    private static function getComponents(): array
    {
        return [
            'securitySchemes' => [
                'bearerAuth' => [
                    'type' => 'http',
                    'scheme' => 'bearer',
                    'bearerFormat' => 'JWT',
                    'description' => 'JWT authorization token',
                ],
            ],
            'schemas' => [
                'Error' => [
                    'type' => 'object',
                    'properties' => [
                        'message' => ['type' => 'string'],
                        'code' => ['type' => 'integer'],
                    ],
                ],
            ],
        ];
    }

    private static function getTags(): array
    {
        return [
            ['name' => 'Guardians', 'description' => 'Guardian profile management'],
            ['name' => 'Complaints', 'description' => 'Complaint lifecycle management'],
            ['name' => 'Finances', 'description' => 'Fee and payment management'],
            ['name' => 'Leaves', 'description' => 'Leave request management'],
            ['name' => 'Attendance', 'description' => 'Attendance and gate movement'],
        ];
    }

    private static function getPaginationParams(): array
    {
        return [
            ['name' => 'page', 'in' => 'query', 'schema' => ['type' => 'integer', 'default' => 1]],
            ['name' => 'per_page', 'in' => 'query', 'schema' => ['type' => 'integer', 'default' => 20, 'maximum' => 100]],
            ['name' => 'sort', 'in' => 'query', 'schema' => ['type' => 'string']],
        ];
    }

    private static function getGuardianRequestBody(): array
    {
        return [
            'required' => true,
            'content' => [
                'application/json' => [
                    'schema' => [
                        'type' => 'object',
                        'properties' => [
                            'full_name' => ['type' => 'string'],
                            'phone' => ['type' => 'string'],
                            'email' => ['type' => 'string', 'format' => 'email'],
                            'relationship' => ['type' => 'string', 'enum' => ['Father', 'Mother', 'Guardian']],
                        ],
                        'required' => ['full_name', 'phone', 'email', 'relationship'],
                    ],
                ],
            ],
        ];
    }

    private static function getComplaintRequestBody(): array
    {
        return [
            'required' => true,
            'content' => [
                'application/json' => [
                    'schema' => [
                        'type' => 'object',
                        'properties' => [
                            'category_id' => ['type' => 'integer'],
                            'title' => ['type' => 'string'],
                            'description' => ['type' => 'string'],
                            'priority' => ['type' => 'string', 'enum' => ['low', 'medium', 'high', 'urgent']],
                        ],
                        'required' => ['category_id', 'title', 'description'],
                    ],
                ],
            ],
        ];
    }

    private static function getLeaveRequestBody(): array
    {
        return [
            'required' => true,
            'content' => [
                'application/json' => [
                    'schema' => [
                        'type' => 'object',
                        'properties' => [
                            'from_date' => ['type' => 'string', 'format' => 'date'],
                            'to_date' => ['type' => 'string', 'format' => 'date'],
                            'reason' => ['type' => 'string'],
                            'contact_during_leave' => ['type' => 'string'],
                        ],
                        'required' => ['from_date', 'to_date', 'reason'],
                    ],
                ],
            ],
        ];
    }

    private static function getAttendanceRequestBody(): array
    {
        return [
            'required' => true,
            'content' => [
                'application/json' => [
                    'schema' => [
                        'type' => 'object',
                        'properties' => [
                            'session_id' => ['type' => 'integer'],
                            'qr_data' => ['type' => 'string'],
                            'timestamp' => ['type' => 'string', 'format' => 'date-time'],
                        ],
                        'required' => ['session_id', 'qr_data'],
                    ],
                ],
            ],
        ];
    }
}
