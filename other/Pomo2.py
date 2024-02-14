import pygame
import time

# Инициализация Pygame
pygame.init()

# Размеры окна
width, height = 200, 100

# Создание окна
window = pygame.display.set_mode((width, height))
pygame.display.set_caption("Таймер помидора")

# Цвета
black = (0, 0, 0)
white = (255, 255, 255)

# Шрифт
font = pygame.font.Font(None, 48)

# Функция для отображения времени
def display_time(time):
    window.fill(black)
    text = font.render(str(time), True, white)
    text_rect = text.get_rect(center=(width/2, height/2))
    window.blit(text, text_rect)
    pygame.display.update()

# Функция для запуска таймера
def start_timer():
    # Время работы в секундах
    work_time = 25 * 60

    # Время перерыва в секундах
    break_time = 5 * 60

    # Флаг для проверки состояния таймера
    running = True

    # Отсчет времени
    while running:
        for event in pygame.event.get():
            if event.type == pygame.KEYDOWN:
                # Если нажата любая клавиша - начинаем отсчет заново
                start_timer()

        # Отображение времени работы
        display_time(work_time // 60)

        # Уменьшение времени работы
        work_time -= 1

        # Проверка окончания работы
        if work_time < 0:
            # Отображение времени перерыва
            display_time(break_time // 60)

            # Пауза после окончания работы
            time.sleep(5)

            # Начинаем отсчет заново
            start_timer()

        # Задержка в 1 секунду
        time.sleep(1)

# Запуск таймера
start_timer()