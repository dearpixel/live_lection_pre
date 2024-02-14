"""
TODO:
1. Автоподсчёт количества периодов - ok
2. Названия периодов - ok
"""

import pygame
import time

# Инициализация Pygame
pygame.init()

# Установка размеров окна
width, height = 250, 150
window = pygame.display.set_mode((width, height))
pygame.display.set_caption("Таймер")

# Установка шрифтов
font_large = pygame.font.Font(None, 48)
font_small = pygame.font.Font(None, 24)

# Время для каждого периода
period_times = [
    [5, 'Подготовка'],
    [30, 'Работа'],
    [30, 'Работа'],
    [30, 'Работа'],
    [30, 'Работа'],
    [10*60, 'Отдых'],
    [30, 'Работа'],
    [30, 'Работа'],
    [30, 'Работа'],
    [30, 'Работа'],
    [10*60, 'Отдых']
]
sum_timers = 0
for period in period_times:
    sum_timers += period[0]

# Звуковой сигнал
pygame.mixer.init()
sound = pygame.mixer.Sound('bell.wav')

# Текущий период и общее количество периодов
current_period = 0
total_periods = len(period_times);

# Время старта таймера
start_time = time.time()

end_time = time.strftime("%H:%M:%S", time.localtime(time.time() + sum_timers))

# Основной цикл программы
running = True
while running:
    # Обработка событий
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Очистка экрана
    window.fill((0, 0, 0))

    # Отображение текущего этапа
    current_stage = "Период {}/{} - {}".format(current_period + 1, total_periods, period_times[current_period][1])
    text_stage = font_small.render(current_stage, True, (180, 180, 180))
    window.blit(text_stage, (10, 10))

    # Отображение оставшегося времени
    elapsed_time = int(time.time() - start_time)
    remaining_time = period_times[current_period][0] - elapsed_time
    text_timer = font_large.render(str(remaining_time), True, (180, 180, 180))
    text_rect = text_timer.get_rect(center=(width // 2, height // 2))
    window.blit(text_timer, text_rect)

    # Отображение времени завершения таймера
    text_end_time = font_small.render("Завершение: " + end_time, True, (180, 180, 180))
    window.blit(text_end_time, (10, height - 30))

    # Проверка окончания периода
    if remaining_time <= 0:
        # Проигрывание звука
        sound.play()

        # Переход к следующему периоду
        current_period += 1
        start_time = time.time()

        # Если все периоды завершены, выход из цикла
        if current_period >= total_periods:
            running = False

    # Обновление окна
    pygame.display.flip()

# Завершение работы Pygame
pygame.quit()