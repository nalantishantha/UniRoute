# Generated migration for TutorAvailability and TutoringBooking models

from django.db import migrations, models
import django.db.models.deletion
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('tutoring', '0001_initial'),
        ('students', '0001_initial'),
        ('student_results', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TutorAvailability',
            fields=[
                ('availability_id', models.AutoField(primary_key=True, serialize=False)),
                ('day_of_week', models.IntegerField(
                    validators=[
                        django.core.validators.MinValueValidator(0),
                        django.core.validators.MaxValueValidator(6)
                    ],
                    help_text='0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday'
                )),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('is_recurring', models.BooleanField(default=True, help_text='Whether this slot repeats weekly')),
                ('max_students', models.IntegerField(
                    default=1,
                    validators=[django.core.validators.MinValueValidator(1)]
                )),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('tutor', models.ForeignKey(
                    on_delete=django.db.models.deletion.DO_NOTHING,
                    related_name='tutor_availability',
                    to='tutoring.tutors',
                    db_constraint=False
                )),
                ('subject', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.DO_NOTHING,
                    to='student_results.alsubjects',
                    db_constraint=False
                )),
            ],
            options={
                'db_table': 'tutor_availability',
                'managed': True,
                'ordering': ['day_of_week', 'start_time'],
            },
        ),
        migrations.CreateModel(
            name='TutoringBooking',
            fields=[
                ('booking_id', models.AutoField(primary_key=True, serialize=False)),
                ('is_recurring', models.BooleanField(default=True, help_text='Whether this is a recurring weekly booking')),
                ('start_date', models.DateField(help_text='First session date')),
                ('end_date', models.DateField(
                    blank=True,
                    null=True,
                    help_text='Last session date (null = ongoing)'
                )),
                ('status', models.CharField(
                    max_length=20,
                    choices=[
                        ('pending', 'Pending Payment'),
                        ('confirmed', 'Confirmed'),
                        ('active', 'Active'),
                        ('cancelled', 'Cancelled'),
                        ('completed', 'Completed')
                    ],
                    default='pending'
                )),
                ('topic', models.CharField(max_length=255, blank=True, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('payment_type', models.CharField(
                    max_length=20,
                    choices=[
                        ('single', 'Single Session'),
                        ('monthly', 'Monthly Package'),
                        ('term', 'Term Package')
                    ],
                    default='single'
                )),
                ('sessions_paid', models.IntegerField(default=1, help_text='Number of sessions paid for')),
                ('sessions_completed', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('student', models.ForeignKey(
                    on_delete=django.db.models.deletion.DO_NOTHING,
                    related_name='tutoring_bookings',
                    to='students.students',
                    db_constraint=False
                )),
                ('tutor', models.ForeignKey(
                    on_delete=django.db.models.deletion.DO_NOTHING,
                    related_name='tutor_bookings',
                    to='tutoring.tutors',
                    db_constraint=False
                )),
                ('availability_slot', models.ForeignKey(
                    on_delete=django.db.models.deletion.DO_NOTHING,
                    related_name='bookings',
                    to='tutoring.tutoravailability',
                    db_constraint=False
                )),
                ('subject', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.DO_NOTHING,
                    to='student_results.alsubjects',
                    db_constraint=False
                )),
            ],
            options={
                'db_table': 'tutoring_bookings',
                'managed': True,
                'ordering': ['-created_at'],
            },
        ),
    ]
