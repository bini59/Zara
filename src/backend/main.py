from datetime import date
from typing import Union
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from model import Base, User as UserModel, SessionLocal, engine, Log as LogModel, Rate as RateModel
from datetime import datetime, timedelta

import csv
from io import StringIO

from Models.User import User

import Utils

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

# CORS
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

prefix = "/api/v1"


## 전체 출근 요약
@app.get(f"{prefix}/attendance/summary")
def get_attendance_summary(db: Session = Depends(get_db)):
    users = db.query(UserModel).all()

    # 현재 날짜와 시간을 가져옵니다.
    now = datetime.now()
    # 오늘의 날짜를 가져옵니다.
    today_date = now.date()
    # 오늘 09:00을 설정합니다.
    today_9am = datetime.combine(today_date, datetime.min.time()) + timedelta(hours=9)
    logs = db.query(LogModel).filter(LogModel.date <= today_9am, LogModel.status == 1).all()

    # 지각자
    late_logs = db.query(LogModel).filter(LogModel.date >= today_9am, LogModel.status == 1).all()

    total = users.__len__()
    on_work = logs.__len__() + late_logs.__len__()
    late = late_logs.__len__()
    off_work, yet = total - on_work, 0
    ## 현재 시간이 12시 이후라면 off_work, yet을 바꿔줍니다.
    if now.hour <= 12:
        off_work, yet = yet, off_work

    week_ago = now - timedelta(days=7)
    rates = db.query(RateModel).filter(RateModel.date >= week_ago).all()
    weekly = {
        "labels": [
            (week_ago + timedelta(days=i)).strftime("%a")
            for i in range(7)
        ],
        "data": [
            rate.rate
            for rate in rates
        ]
    }
    print(weekly)

    return {
        "on_work": on_work, 
        "off_work": off_work, 
        "yet_to_clock_out": yet,
        "late": late,
        "early_leave": 1,
        "total": total, 
        "weekly" : weekly
    }


## 유저 개인 출근 요약
@app.get(prefix+"/attendance/{employee_id}")
def get_attendance_summary(employee_id: int, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.no == employee_id).first()

    logs = db.query(LogModel).filter(LogModel.mac == user.mac).all()

    now = datetime.now()
    # 오늘의 날짜를 가져옵니다.
    today_date = now.date()
    # 오늘 09:00을 설정합니다.
    today_9am = datetime.combine(today_date, datetime.min.time()) + timedelta(hours=9)
    late_logs = db.query(LogModel).filter(LogModel.date >= today_9am, LogModel.status == 1, LogModel.mac == user.mac).all()

    total = Utils.calculate_date(user.date)
    on_work = logs.__len__()
    off_work = total - on_work
    late = late_logs.__len__()


    return {
        "on_work": on_work, 
        "off_work": off_work, 
        "late": late,
        "total": total
    }



## 유저 가입 신청 목록
@app.get(f"{prefix}/employees/new")
def get_new_employee(db: Session = Depends(get_db)):
    new_users = db.query(UserModel).filter(UserModel.status == 0).all()
    
    data = []
    for user in new_users:
        data.append([user.no, user.name, user.date])

    return {
        "total": 2,
        "header": ['번호', '이름', '입사일', '등록'],
        "data": data
    }

## 유저 목록
@app.get(f"{prefix}/employees/list")
def get_employee_list(db: Session = Depends(get_db)):

    users = db.query(UserModel).filter(UserModel.status == 1).all()
    data = [
        [user.no, user.name, str(Utils.getAttendanceRate(user)) + "%", Utils.getNowOnWork(user)]
        for user in users
    ]
    return {
        "total": 2,
        "header": ['번호', '이름', '출근율', '현재 근무 상태'],
        "data": data
    }



## 로그 다운로드 => 현재 수정 되야함.
@app.get(f"{prefix}/logs/download")
def download_logs(db: Session = Depends(get_db)):
    logs_with_names = db.query(LogModel, UserModel.name).join(UserModel, UserModel.mac == LogModel.mac).all()

    def iter_csv():
        fieldnames = ["no", "name", "date", "status"]
        output = StringIO()
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()

        for log, name in logs_with_names:
            writer.writerow(
                {
                    "no": log.no, 
                    "name": name, 
                    "date": Utils.convert_datetime_to_string(log.date), 
                    "status" : "출근" if log.status == 1 else "퇴근"
                }
            )
            yield output.getvalue().encode('utf-8-sig')
            output.seek(0)
            output.truncate(0)

    response = StreamingResponse(iter_csv(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=users.csv"
    return response

## 유저 개인 로그
@app.get(prefix+"/logs/{log_id}")
def get_log_by_id(log_id: int, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.no == log_id).first()
    logs = db.query(LogModel).filter(LogModel.mac == user.mac).all()

    data = [
        [log.no, user.name, Utils.convert_datetime_to_string(log.date), "출근" if log.status == 1 else "퇴근"]
        for log in logs
    ]

    return{
        "total": logs.__len__(),
        "header": ['번호', '이름', '일시', '출근/퇴근'],
        "data": data
    }




## 전체 로그
@app.get(f"{prefix}/logs")
def get_logs(db: Session = Depends(get_db)):
    logs_with_names = db.query(LogModel, UserModel.name).join(UserModel, UserModel.mac == LogModel.mac).all()
    data = [
        [log.no, name, Utils.convert_datetime_to_string(log.date), "출근" if log.status == 1 else "퇴근"]
        for log, name in logs_with_names
    ]

    return {
        "total": logs_with_names.__len__(),
        "header": ['번호', '이름', '일시', '출근/퇴근'],
        "data": data
    }



"""
 - 금월 주차별 출근율
 - 1년 월별 출근율

"""
@app.get(prefix+"/detail/{employee_id}")
def get_employee_detail(employee_id: int):
    return {
        "weekly" : [
            94, 92, 93, 95
        ],
        "monthly" : [
            94, 92, 93, 95, 96, 97, 98, 91, 92, 93, 94, 95
        ]
    }


## 유저 가입 절차. 정보를 받아옴
@app.post(prefix+"/employees")
async def post_employee(data: User, db: Session = Depends(get_db)):
    user_mac = Utils.getMacAddressFromIP(data.ip_address)

    db_user = UserModel(name=data.username, status=0, mac=user_mac, date=date.today())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {
        "status": "success",
        "data": db_user
    }

## 유저 가입 승인
@app.get(prefix+"/employees/apply/{employee_id}")
def apply_employee(employee_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.no == employee_id).first()

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.status = 1
    db.commit()
    db.refresh(db_user)

    return {
        "status": "success",
        "data": {
            "id": employee_id
        }
    }