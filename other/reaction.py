import pygame
import random
import time

# Инициализация Pygame
pygame.init()

# Цвета
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)

# Установка экрана
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Реакция на цвет')

# Шрифт
font = pygame.font.Font(None, 36)

# Переменные
running = True
delay = 2000  # начальная задержка в миллисекундах
average_delay = 0
attempts = 0

# Главный цикл игры
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            if current_color == WHITE:
                average_delay = (average_delay * attempts + delay) / (attempts + 1)
                attempts += 1
                delay = 2000
            else:
                delay = int(time.time() * 1000 - start_time)

    current_color = WHITE  # начальный цвет
    draw_time = True

    # Цикл смены цвета
    start_time = time.time() * 1000
    color_change_time = start_time + delay
    while time.time() * 1000 < color_change_time:
        if current_color == WHITE:
            current_color = random.choice([RED, GREEN])
            pygame.draw.rect(screen, current_color, (0, 0, WIDTH, HEIGHT))
        pygame.display.flip()

    # Отображение результата
    if draw_time:
        screen.fill(WHITE)
        text = font.render(f'Задержка: {delay} мс', True, (0, 0, 0))
        text_rect = text.get_rect(center=(WIDTH//2, HEIGHT//2))
        screen.blit(text, text_rect)
        pygame.display.flip()
        draw_time = False

    # Отображение средней задержки
    if attempts > 0:
        average_text = font.render(f'Средняя задержка: {int(average_delay)} мс', True, (0, 0, 0))
        average_rect = average_text.get_rect(center=(WIDTH//2, HEIGHT//2 + 50))
        screen.blit(average_text, average_rect)
        pygame.display.flip()

pygame.quit()
