from sqlalchemy import Column, Integer, String, create_engine, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./zara"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    no = Column(Integer, primary_key=True, index=True)
    mac = Column(String, index=True)
    name = Column(String, index=True)
    status = Column(Integer, unique=False, index=True)
    date = Column(String, index=True)

class Log(Base):
    __tablename__ = "logs"
    no = Column(Integer, primary_key=True, index=True)
    mac = Column(String, index=True)
    date = Column(DateTime, index=True, default=datetime.utcnow)
    status = Column(Integer, unique=False, index=True)

class Rate(Base):
    __tablename__ = "rates"
    no = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, index=True, default=datetime.utcnow)
    rate = Column(Integer, index=True)

Base.metadata.create_all(bind=engine)
