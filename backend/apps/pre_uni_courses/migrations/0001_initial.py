# Migration for pre_uni_courses app

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        # Execute raw SQL to add columns to existing table
        migrations.RunSQL(
            """
            ALTER TABLE pre_university_courses 
            ADD COLUMN IF NOT EXISTS category VARCHAR(100) NULL,
            ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Draft',
            ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NULL,
            ADD COLUMN IF NOT EXISTS duration VARCHAR(100) NULL,
            ADD COLUMN IF NOT EXISTS thumbnail TEXT NULL,
            ADD COLUMN IF NOT EXISTS enrollments INT DEFAULT 0,
            ADD COLUMN IF NOT EXISTS rating DECIMAL(3,1) DEFAULT 0.0,
            ADD COLUMN IF NOT EXISTS created_by_id INT NULL,
            ADD COLUMN IF NOT EXISTS updated_at DATETIME NULL;
            """,
            reverse_sql="""
            ALTER TABLE pre_university_courses 
            DROP COLUMN IF EXISTS category,
            DROP COLUMN IF EXISTS status,
            DROP COLUMN IF EXISTS price,
            DROP COLUMN IF EXISTS duration,
            DROP COLUMN IF EXISTS thumbnail,
            DROP COLUMN IF EXISTS enrollments,
            DROP COLUMN IF EXISTS rating,
            DROP COLUMN IF EXISTS created_by_id,
            DROP COLUMN IF EXISTS updated_at;
            """
        ),
        
        # Create CourseContent table
        migrations.CreateModel(
            name='CourseContent',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('course_id', models.IntegerField()),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True)),
                ('content_type', models.CharField(choices=[('video', 'Video'), ('text', 'Text'), ('pdf', 'PDF'), ('quiz', 'Quiz'), ('assignment', 'Assignment')], max_length=50)),
                ('content_url', models.URLField(blank=True, null=True)),
                ('content_text', models.TextField(blank=True)),
                ('order', models.IntegerField(default=0)),
                ('duration_minutes', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'pre_uni_course_contents',
                'ordering': ['order'],
            },
        ),
        
        # Create CourseEnrollment table
        migrations.CreateModel(
            name='CourseEnrollment',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('course_id', models.IntegerField()),
                ('student_id', models.IntegerField()),
                ('enrollment_date', models.DateTimeField(auto_now_add=True)),
                ('completion_date', models.DateTimeField(blank=True, null=True)),
                ('status', models.CharField(choices=[('active', 'Active'), ('completed', 'Completed'), ('dropped', 'Dropped'), ('pending', 'Pending')], default='active', max_length=50)),
                ('progress_percentage', models.DecimalField(decimal_places=2, default=0.0, max_digits=5)),
                ('rating', models.DecimalField(blank=True, decimal_places=1, max_digits=3, null=True)),
                ('review', models.TextField(blank=True)),
            ],
            options={
                'db_table': 'pre_uni_course_enrollments',
                'unique_together': {('course_id', 'student_id')},
            },
        ),
    ]
