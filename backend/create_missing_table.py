"""
Script to create the missing counsellor_availability_exceptions table
"""
import os
import django
import sys

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_core.settings')
django.setup()

from django.db import connection

# SQL to create the missing table
sql = """
CREATE TABLE IF NOT EXISTS `counsellor_availability_exceptions` (
  `exception_id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `exception_type` varchar(16) NOT NULL,
  `reason` longtext,
  `created_at` datetime(6) NOT NULL,
  `counsellor_id` int NOT NULL,
  PRIMARY KEY (`exception_id`),
  KEY `counsellor_availabi_counsellor_id_12345678_fk_counsello` (`counsellor_id`),
  UNIQUE KEY `counsellor_availability_counsellor_id_date_star_12345678_uniq` (`counsellor_id`,`date`,`start_time`,`end_time`),
  CONSTRAINT `counsellor_availabi_counsellor_id_12345678_fk_counsello` FOREIGN KEY (`counsellor_id`) REFERENCES `counsellors` (`counsellor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
"""

try:
    with connection.cursor() as cursor:
        cursor.execute(sql)
    print("✅ Table 'counsellor_availability_exceptions' created successfully!")
except Exception as e:
    print(f"❌ Error: {e}")
    print("Table might already exist or there's a different issue.")
