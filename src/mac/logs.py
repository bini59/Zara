import redis
import time
import schedule

# Redis 서버에 연결
r = redis.Redis(host='localhost', port=6379, db=0)

# MAC 주소와 카운트를 저장할 배열
mac_addresses = []

def fetch_redis_data():
    global mac_addresses
    # Redis로부터 데이터 가져오기
    keys = r.keys('*')
    current_macs = set()
    print(keys)
    
    for key in keys:
        data = r.get(key).decode('utf-8')
        parts = data.split()
        current_macs.add(key)
        
        # MAC 주소가 배열에 없으면 추가
        if not any(mac[0] == key for mac in mac_addresses):
            mac_addresses.append([key, 0])
    
    # 기존 배열에서 Redis에 없는 MAC 주소의 카운트를 증가
    for mac in mac_addresses:
        if mac[0] not in current_macs:
            mac[1] += 1
            
    print(mac_addresses)

def main():
    # 10초마다 fetch_redis_data 함수 실행
    schedule.every(1).seconds.do(fetch_redis_data)
    
    while True:
        schedule.run_pending()
        
        time.sleep(1)

if __name__ == "__main__":
    main()