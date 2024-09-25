---
published : true
title:  " python 게임 개발 틀"
excerpt: "python강의를 통해서 배운 게임 개발의 기초 틀을 설명"

categories:
  - Blog
tags:
  - [Blog, python, Github]

toc: true
toc_sticky: true
 
date: 2024-09-22
last_modified_at: 2024-09-22
---
# python(2024-09-23)

파이썬 게임 제작 
- 화면과 스테이지 캐릭터와 공, 무기가 있고 캐릭터는 x좌표에서만 움직일 수 있다. space바를 누르면 무기가 위쪽으로 올라가고 만약 공에 닿으면 공은 2개로 분열된다.

- 게임을 승리를 하려면 공을 제한시간(100s)안에 제거를 해야하고 제한시간을 넘거나 공에 캐릭터가 닿으면 패배를 하게 된다.
## 1. 기본 틀
```
import os
import pygame
#######################
# 기본 초기화

pygame.init() # 초기화 (반드시 필요)

# 화면 크기 설정
screen_width = 480 # 가로 크기
screen_height = 640 # 세로 크기
screen = pygame.display.set_mode((screen_width, screen_height))

# 화면 타이틀 설정
pygame.display.set_caption("Nado Pang") #게임 이름

#fps
clock = pygame.time.Clock()
########################################

# 1. 사용자 게임 초기화(배경 화면, 게임 이미지, 좌표, 폰트 등)
# 배경 이미지 불러오기
current_path = os.path.dirname(__file__) # 현재 파일의 위치 반환
image_path = os.path.join(current_path, "images") # images 폴더 위치 반환

# 배경 만들기
background = pygame.image.load(os.path.join(image_path , "background.png"))

# 스테이지 만들기
stage = pygame.image.load(os.path.join(image_path , "stage.png"))
stage_size = stage.get_rect().size
stage_height = stage_size[1] # 스테이지의 높이 위에 캐릭터를 두기 위해 사용

# 캐릭터 만들기 
character = pygame.image.load(os.path.join(image_path , "character.png"))
character_size = character.get_rect().size
character_width = character_size[0] # 캐릭터의 가로크기
character_height = character_size[1] # 캐릭터의 세로 크기
character_x_pos = (screen_width / 2) - (character_width / 2) # 화면 가로의 절반 크기에 해당하는 곳에 위치(가로)
character_y_pos = screen_height - character_height - stage_height

running = True 
while running:
    dt = clock.tick(60) 
   
    # 2. 이벤트 처리(키보드, 마우스 등)
    
    print("fps : " + str(clock.get_fps())) 
    
    for event in pygame.event.get(): # 이벤트 루프가 게속 프로그램이 종료되지 않게
        #하고 있음 / 어떤 이벤트가 발생하였는가?
        if event.type == pygame.QUIT: # 창이 닫히는 이벤트가 발생하였는가?(창 닫기)
            running = False # 게임이 진행중이  아님
    # 3. 게임 캐릭터 위치 정의

    # 4. 충돌 처리

    # 5. 화면에 그리기
    screen.blit(background, (0, 0))
    screen.blit(stage, (0, screen_height - stage_height))
    screen.blit(character, (character_x_pos, character_y_pos))
    
    
    pygame.display.update() 
    

# pygame 종료          
pygame.quit()
```
## 2. 이벤트 처리
```
# 캐릭터 이동방향
character_to_x = 0 # 음수는 왼쪽으로 이동 양수는 오른쪽으로 이동
# 캐릭터 이동속도
character_speed = 5 

running = True 
while running:
    dt = clock.tick(60) 
    
    print("fps : " + str(clock.get_fps())) 
    
    for event in pygame.event.get():
        
        if event.type == pygame.QUIT:
            running = False
            
# ---------------------------------------------------------
        if event.type == pygame.KEYDOWN: # 키를 눌렀을 때(KEYDOWN은 대문자)
            if event.key == pygame.K_LEFT: # (event.keys는 소문자, K_LEFT는 대문자)
                character_to_x -= character_speed
            elif event.key == pygame.K_RIGHT:
                character_to_x += character_speed
            elif event.key == pygame.K_SPACE:
                weapon_x_pos = character_x_pos + (character_width/2) - (weapon_width/2)
                weapon_y_pos = character_y_pos
                weapons.append([weapon_x_pos, weapon_y_pos])
            
        if event.type == pygame.KEYUP: # 키를 떼었을 때
            if event.key == pygame.K_LEFT or event.key == pygame.K_RIGHT:
                character_to_x = 0
                

    character_x_pos += character_to_x 
# -------------------------------------------------
```
## 3. 게임 캐릭터 위치 정의
- 캐릭터가 화면안에 있도록
```
if character_x_pos < 0: # 0보다 작으면 화면 왼쪽을 빠져나감
        character_x_pos = 0
    elif character_x_pos >= screen_width - character_width: # 캐릭터 그림의 왼쪽에 좌표가 위치하므로 캐릭터의 넓이를 빼야함
        character_x_pos = screen_width - character_width
```
- 무기 위치 조정
```
# 여려개의 weapon
weapons = []

# weapon의 speed
weapon_speed = 10

weapons = [[w[0], w[1] - weapon_speed] for w in weapons if w[1] > 0]
         
```
weapon은 캐릭터와 다르게 여러개가 존재하고 시작할 때 부터 있는 것이 아니라 space바를 누르면 생성이 되므로 리스트를 만들고 space바를 누르면 리스트에다가 좌표를 넣고 좌표에서 y좌표만 뺴는 것을 계속 반복한다.(위에 있는 while running안에 작성을 하므로 조건을 만족할 때 까지 반복한다.) 이 것을 위해서 리스트 내포를 사용하고 리스트 내포에 if문을 사용하여 y값이 천장에 닿지 않은 것만 뺴는 것을 반복한다.

- 공 생성
```

balls = []

ball_images = [
    pygame.image.load(os.path.join(image_path , "ballon1.png")),
    pygame.image.load(os.path.join(image_path , "ballon2.png")),
    pygame.image.load(os.path.join(image_path , "ballon3.png")),
    pygame.image.load(os.path.join(image_path , "ballon4.png"))    
] # 공 이미지가 여러 개이므로 리스트에 각각 저장하고 인덱스를 사용하여 필요한 이미지를 사용한다.

ball_speed_y = [-15, -12, -9, -6] # 공의 이미지(크기)에 따라 시작 속도를 다르게 지정

balls.append({
    "pos_x": 50,
    "pos_y": 50,
    "img_idx": 0,
    "to_x": 3,
    "to_x": -6, 
    "init_spd_y": ball_speed_y[0]
})

```
- 공 위치 조정
```
for ball_idx, ball_val in enumerate(balls):
        ball_pos_x = ball_val["pos_x"]
        ball_pos_y = ball_val["pos_y"]
        ball_img_idx = ball_val["img_idx"]
        ball_size = ball_images[ball_img_idx].get_rect().size
        ball_width = ball_size[0]
        ball_height = ball_size[1]   
```
enumerate함수는 대상의 인덱스와 요소를 동시에 추출할 수 있게 해주는 함수이다. 
```
if ball_pos_x <= 0 or ball_pos_x > screen_width - ball_width: # 공이 화면 밖을 벗어나면
            ball_val["to_x"] = ball_val["to_x"] * -1  # 반대 방향으로
            
        # 세로 위치
        # 스테이지에 튕겨서 올라가는 처리
        if ball_pos_y >= screen_height - stage_height - ball_height:
            ball_val["to_y"] = ball_val["init_spd_y"]
        else: # 그 외의 모든 경우에는 속도를 증가
            ball_val["to_y"] += 0.5 # 공이 바닥에 닿으면 원래속도 ex) -12를 받음. -> -12면 y축에서는 올라가는 것 하지만 점점더 0.5씩 감소하다가 언젠가는 역전되서 +값으로 다시 땅으로 떨어짐 -> 반복
            
        ball_val["pos_x"] += ball_val["to_x"] #이동 방향이 실시간으로 계속해서 더해짐 벽에 닿으면 다시 반대쪽으로 더해짐 -> 속도 증가는 x
        ball_val["pos_y"] += ball_val["to_y"]
```
## 4. 충돌 처리
```
character_rect = character.get_rect() # 충돌 처리를 위해 get.rect() 매서드를 사용하고 현재 캐릭터의 좌표를 지정
character_rect.left = character_x_pos
character_rect.right = character_y_pos

for ball_idx, ball_val in enumerate(balls): # balls에는 리스트안에 공들의 정보가 딕셔너리로 저장되어져 있다. 하나 하나 다 값을 가져오기 위해서 반복문과 enumerate사용
        ball_pos_x = ball_val["pos_x"] # pox_x는 공의 현재 좌표이다.
        ball_pos_y = ball_val["pos_y"]
        ball_img_idx = ball_val["img_idx"] #img_idx 0은 가장 큰 공, 1은 다음으로 큰 공....
        
        # 공 rect 정보 업데이트
        ball_rect = ball_images[ball_img_idx].get_rect()
        ball_rect.left = ball_pos_x
        ball_rect.top = ball_pos_y

        # 공과 캐릭터 충돌 처리
        if character_rect.colliderect(ball_rect):
            running = False
            break
        # 공과 무기들 충돌 처리
        for weapon_idx, weapon_val in enumerate(weapons): # 위에 for문에서 첫 번쨰 공을 가지고 와서 무기 전체와 비교.. 2번재 공...
            weapon_pos_x = weapon_val[0] # 현재 weapon의 좌표
            weapon_pos_y = weapon_val[1]
            
            # 무기 rect정보 업데이트
            weapon_rect = weapon.get_rect()
            weapon_rect.left = weapon_pos_x
            weapon_rect.top = weapon_pos_y
            
            # 충돌체크
            if weapon_rect.colliderect(ball_rect):
                weapon_to_remove = weapon_idx # 해당 무기 없애기 위한 값 설정
                ball_to_remove = ball_idx # 해당 공 없애기 위한 설정
                
                    # 현재 공 크기 정보를 가지고 옴
                if ball_img_idx < 3:
                    ball_width = ball_rect.size[0] # ball의 가로, 세로크기
                    ball_height = ball_rect.size[1]
                    
                    # 나눠진 공 정보
                    small_ball_rect = ball_images[ball_img_idx + 1].get_rect()
                    small_ball_width = small_ball_rect.size[0]
                    small_ball_height = small_ball_rect.size[1]
            
                if ball_img_idx < 3: # 0,1,2 가장 작은 공이 아니면 두개로 나누어짐
                    balls.append({ # 2개의 공 중에서 오른쪽으로 갈 작은 공
                        "pos_x" : ball_pos_x + (ball_width/2) - (small_ball_width/2), # 현재 공의 좌표에 오른쪽으로 약간 이동
                        "pos_y" : ball_pos_y + (ball_height/2) - (small_ball_height/2), # 공의 y좌표
                        "img_idx" : ball_img_idx + 1, # 공의 이미지 인덱스(어떤 공 이미지를 쓸지) 
                        "to_x" : 3, # x축 이동방향, -3 이면 왼쪽으로, 3이면 오른쪽으로
                        "to_y" : -6, # y축 이동방향, 
                        "init_spd_y" : ball_speed_y[ball_img_idx + 1] # y 최초 속도
                        })
             
                    balls.append({
                        "pos_x" : ball_pos_x - (ball_width/2) + (small_ball_width/2), 
                        "pos_y" : ball_pos_y + (ball_height/2) - (small_ball_height/2), # 공의 y좌표
                        "img_idx" : ball_img_idx + 1, # 공의 이미지 인덱스(어떤 공 이미지를 쓸지) 
                        "to_x" : -3, # x축 이동방향, -3 이면 왼쪽으로, 3이면 오른쪽으로
                        "to_y" : -6, # y축 이동방향, 
                        "init_spd_y" : ball_speed_y[ball_img_idx + 1] # y 최초 속도
                        })
                break
        else: # 게속 게임 진행
            continue #안쪽for문 조건이 맞지 않으면 continue. 바깥 for문 계속 수행
        break # 안쪽 for문에서 break를 만나면 여기로 진입 가능.2중 for문을 한번에 탈출

    # 충돌된 공 or 무기 없애기
    if ball_to_remove > -1: # ball_to_remove의 값은 항상 -1이고 지워져야 할 공의 인덱스(0부터 시작이므로 항상 -1이보다는 크다)의 값이 들어오면 들어온 인덱스를 삭제하고 -1을 다시 넣는다
        del balls[ball_to_remove]
        ball_to_remove = -1

    if weapon_to_remove > -1:
        del weapons  [weapon_to_remove]
        weapon_to_remove = -1
        
    # 모든 공을 없앤 경우 게임 종료(성공)
    if len(balls) == 9:
        game_result = "Mission Coplete"
        running = False 
```
1. 캐릭터의 rect정보 업데이트

2. 공들의 rect정보를 업데이트 시키는 for문

3. for문 안에서 if문으로 충돌처리, 

4. 충돌된 공과 무기 없애기

## 5. 화면에 , 게임 시간, 승리 패배 메시지
```
screen.blit(background, (0, 0))
    
    for weapon_x_pos, weapon_y_pos in weapons:
        screen.blit(weapon, (weapon_x_pos, weapon_y_pos)) # 무기 위치 조정에서 weapons의 x 좌표값은 그대로지만 y좌표값이 바뀌게 됨 -> 바뀌는 대로 y좌표로 올라가면서 생성되게 됨
    # 무기를 배경 바로 다음에 위치시켜서 캐릭터위에서 생성되는 것을 막음
        
    for idx, val in enumerate(balls):
        ball_pos_x = val["pos_x"]
        ball_pos_y = val["pos_y"]
        ball_img_idx = val["img_idx"]
        screen.blit(ball_images[ball_img_idx], (ball_pos_x, ball_pos_y))
    screen.blit(stage, (0, screen_height - stage_height))
    screen.blit(character, (character_x_pos, character_y_pos))
    
    # 경과 시간 계산
    elapsed_time = (pygame.time.get_ticks() - start_ticks) / 1000 
    timer = game_font.render("Time : {}".format(int(total_time - elapsed_time)), True, (255,255,255)) # total_time에 게임의 제한 시간을 지정한다. 이 후 경가된 시간을 빼면 제한 시간이 되게 된다. ex) 100초가 제한시간이면  99, 98, 97 ---> 이런식으로 점점 시간이 감소하게 표시된다.
    screen.blit(timer, (10, 10))           
    
    # 시간 초과했다면
    if total_time - elapsed_time <= 0:
        game_result = "Time Over"
        running= False
        
    pygame.display.update() 
    
# 게임 오버 메시지
msg = game_font.render(game_result, True, (255, 255, 0)) 
msg_rect = msg.get_rect(center = (int(screen_width/2), int(screen_height/2)))
screen.blit(msg, msg_rect)
pygame.display.update() 

# 2초 대기
pygame.time.delay(2000) # 게임이 끝나고 2초이후 종료
```
- 게임 시간 설정
```
 elapsed_time = (pygame.time.get_ticks() - start_ticks) / 1000
```

이 코드는 게임의 경과 시간을 구하는 코드이다. pygame.time.get_ticks()는 게임이 시작된 이후 흐른 시간을 밀리초 단위로 반환하는 매서드이고 게임을 시작하는 시점의 시간을 기준점으로 삼기 위해, 게임이 시작될 때 start_ticks에 pygame.time.get_ticks() 값을 저장한다. 이렇게 저장된 값이 기준 시간이 되어, 이후 경과 시간을 계산하는 데 사용된다. 이 두개를 빼서 경과 시간을 계산한다. start_ticks를 빼지 않게 되면 여러가지 오류가 발생하므로 꼭 빼야한다.

- 게임 종료


시간이 종료되거나 캐릭터와 공이 충돌하면 게임 종료되고 time over, game over이 출력, 공을 다 제거하면 misson complete가 출력된다. 또한 게임 오버 메시지를 이벤트키 반복문 밖에 두어서 3가지의 게임 종료 상황이 오면 반복문을 종료하게 만들어서 바로 메시지를 출력하게 작성하였다.


--------------------------------------------------------------
\- get_rect()와 get_rect().size의 차이는 무엇이고 언제 사용이 될까?

get_rect() 매서드는 pygame객체에 있는 매서드이고 get_rect()와 get_rect().size의 차이는 get_rect()는 대상 객체의 표면의 위치(x, y좌표)와 크기(가로, 세로 길이)를 반환하고 get_rect().size는 대상 객체의 너비와 높이만을 반환한다. 

get_rect()는 충돌 처리를 할 때 주로 사용되고 
```
if character_rect.colliderect(ball_rect):
```
이런 식으로 값을 반환한 변수를 이용하여 다른 rect값을 가지고 있는 이미지와 충돌 처리를 한다.

get_rect().size는 가로, 세로 크기만 반환하므로 주로 위에 기본 틀에서 사용된 것처럼 이미지를 그리기 전에 x, y좌표를 지정하기 위해 필요한 이미지의 가로, 세로 크기를 얻기 위해서 사용된다.
```
character = pygame.image.load(os.path.join(image_path , "character.png"))
character_size = character.get_rect().size
character_width = character_size[0] # 캐릭터의 가로크기
character_height = character_size[1] # 캐릭터의 세로 크기
character_x_pos = (screen_width / 2) - (character_width / 2) # 화면 가로의 절반 크기에 해당하는 곳에 위치(가로)
character_y_pos = screen_height - character_height - stage_height
```
---------------------------------------------------------------------

----------------------
\- for문으로 공들의 정보를 가져와 충돌검사를 하는데 그 for문 안에 weapon들의 정보를 가져오는 for문을 넣어서 중첩 for문을 했을까? 따로따로 for문으로 정보들을 가져와서 충돌검사를 하면 안되나??

내부 for문을 작성하지 않게 되면 하나의 공이 특정 무기와만 충돌하는지 확인하게 되고 그 외의 무기들과 비교할 기회가 사라지게 된다. 즉, 각각의 공에 대해 모든 무기와 충돌을 확인해야 하므로 for문을 중첩시켜야 한다.

동작 흐름:
1. 첫 번째 공을 선택 (balls 리스트에서).
2. 그 공과 화면에 있는 모든 무기들의 충돌을 검사 (weapons 리스트에서).
3. 공이 무기와 충돌하면 그 공과 무기를 제거하고, 그 공이 여러 조각으로 나뉘는 등의 로직을 처리.
4. 한 공에 대해 충돌 확인이 끝나면, 다음 공에 대해 같은 작업을 반복.

이 구조를 통해, 게임 내에서 모든 공이 모든 무기와 충돌하는지 확인할 수 있게 된다.


-----------------------------