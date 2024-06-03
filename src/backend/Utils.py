from datetime import datetime

def getMacAddressFromIP(ip):
    return "00:00:00:00:00:00"

def getAttendanceRate(user):
    if user.name == "서장준":
        return 95
    return 0

def getNowOnWork(user):
    return True

"""
2024-06-03T00:24:53.678034 -> "2024-06-03 00:24:53"

"""
def convert_datetime_to_string(datetime: datetime):
    return datetime.strftime("%Y-%m-%d %H:%M:%S")

def calculate_date(date_str, date_format="%Y-%m-%d"):
    try:
        # 문자열을 datetime 객체로 변환
        start_date = datetime.strptime(date_str, date_format)
        # 오늘 날짜 가져오기
        today_date = datetime.today()
        # 두 날짜 사이의 차이 계산
        delta = today_date - start_date
        # 일수 반환
        return delta.days+1
    except ValueError as e:
        print(f"Invalid date format: {e}")
        return None