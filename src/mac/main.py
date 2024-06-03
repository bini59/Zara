import redis
import sys
import scapy.all as scapy
import time
import os
import netifaces

def get_gateway_ip():
    gws = netifaces.gateways()
    default_gateway = gws.get('default')
    if default_gateway:
        ipv4_gateway = default_gateway.get(netifaces.AF_INET)
        if ipv4_gateway:
            return ipv4_gateway[0]
    return None

def get_mac(ip):
    # ARP 요청 패킷 생성
    arp_request = scapy.ARP(pdst=ip)
    # 이더넷 프레임 생성
    broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
    # ARP 요청과 이더넷 프레임 결합
    arp_request_broadcast = broadcast/arp_request
    # 패킷을 보내고 응답 받기
    answered_list = scapy.srp(arp_request_broadcast, timeout=1, verbose=False)[0]
    
    return answered_list[0][1].hwsrc if answered_list else None

if __name__ == "__main__":
    gateway_ip = get_gateway_ip()
    if gateway_ip:
        gateway_mac = get_mac(gateway_ip)
        if gateway_mac:
            print(f"Gateway IP: {gateway_ip}")
            print(f"Gateway MAC: {gateway_mac}")
        else:
            print("게이트웨이의 MAC 주소를 찾을 수 없습니다.")
    else:
        print("게이트웨이 IP 주소를 찾을 수 없습니다.")

    alive_time = 300
    r = redis.Redis('localhost')

    while True:
        for i in range(8):
            for ip in range(0, 31):
                net = '192.168.0.' + str(ip + 32 * int(sys.argv[1]))
                ans, noans = scapy.arping(net, timeout=1, verbose=False)

                if not ans.res:
                    pass
                else:
                    received = ans.res[0][1]
                    ip = str(received.psrc)
                    mac = str(received.hwsrc)

                    info = str(int(time.time())) + " " + ip + " " + gateway_mac
                    print(info)

                    if not r.exists(mac):  # 새로운 항목일 경우, Redis에 등록
                        print("New %s\t%s ->" % (ip, mac), r.setex(mac, alive_time, info))
                    else:  # 기존 항목일 경우, 시간 업데이트
                        print("Update %s\t%s ->" % (ip, mac), r.setex(mac, alive_time, info))
            # Redis 정리 루프는 현재 비활성화됨

