# Generated by Django 5.2.3 on 2025-07-12 15:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
        ('student_results', '0001_initial'),
        ('university_students', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tutors',
            fields=[
                ('tutor_id', models.AutoField(primary_key=True, serialize=False)),
                ('bio', models.TextField(blank=True, null=True)),
                ('expertise', models.CharField(blank=True, max_length=255, null=True)),
                ('rating', models.DecimalField(blank=True, decimal_places=1, max_digits=2, null=True)),
                ('created_at', models.DateTimeField(blank=True, null=True)),
                ('university_student', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='university_students.universitystudents')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='accounts.users')),
            ],
            options={
                'db_table': 'tutors',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='TutorRatings',
            fields=[
                ('rating_id', models.AutoField(primary_key=True, serialize=False)),
                ('rating', models.JSONField()),
                ('created_at', models.DateTimeField(blank=True, null=True)),
                ('rater_user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='accounts.users')),
                ('tutor', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='tutoring.tutors')),
            ],
            options={
                'db_table': 'tutor_ratings',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='TutoringSessions',
            fields=[
                ('session_id', models.AutoField(primary_key=True, serialize=False)),
                ('scheduled_at', models.DateTimeField()),
                ('duration_minutes', models.IntegerField(blank=True, null=True)),
                ('status', models.CharField(blank=True, max_length=9, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(blank=True, null=True)),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='student_results.alsubjects')),
                ('tutor', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='tutoring.tutors')),
            ],
            options={
                'db_table': 'tutoring_sessions',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='TutorFeedback',
            fields=[
                ('feedback_id', models.AutoField(primary_key=True, serialize=False)),
                ('feedback', models.TextField()),
                ('created_at', models.DateTimeField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='accounts.users')),
                ('tutor', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='tutoring.tutors')),
            ],
            options={
                'db_table': 'tutor_feedback',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='TutorSubjects',
            fields=[
                ('tutor_subject_id', models.AutoField(primary_key=True, serialize=False)),
                ('level', models.CharField(blank=True, max_length=5, null=True)),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='student_results.alsubjects')),
                ('tutor', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='tutoring.tutors')),
            ],
            options={
                'db_table': 'tutor_subjects',
                'managed': True,
            },
        ),
    ]
