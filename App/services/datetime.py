# utils.py
from datetime import datetime

def convert_to_date(date_value):
    """Converts a string or datetime object to a date."""
    if isinstance(date_value, str):
        return datetime.strptime(date_value, "%Y-%m-%d").date()
    return date_value

def convert_to_time(time_value):
    """Converts a string or time object to a time."""
    if isinstance(time_value, str):
        return datetime.strptime(time_value, "%H:%M").time()
    return time_value 
