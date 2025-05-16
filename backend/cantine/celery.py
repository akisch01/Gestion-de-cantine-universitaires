import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'expirer-reservations': {
        'task': 'cantine.tasks.expirer_reservations',
        'schedule': crontab(minute=0, hour='*/1'),  # Toutes les heures
    },
}