import pygame
import time

pygame.init()

window_width = 200
window_height = 100

window = pygame.display.set_mode((window_width, window_height))
pygame.display.set_caption("Pomodoro Timer")

clock = pygame.time.Clock()

font = pygame.font.Font(None, 80)

def countdown_timer(minutes):
    start_time = time.time()
    end_time = start_time + minutes * 60

    while time.time() < end_time:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()

        window.fill((255, 255, 255))

        remaining_time = int(end_time - time.time())
        minutes = remaining_time // 60
        seconds = remaining_time % 60

        text = font.render(f"{minutes:02d}:{seconds:02d}", True, (0, 0, 0))
        text_rect = text.get_rect(center=(window_width // 2, window_height // 2))
        window.blit(text, text_rect)

        pygame.display.update()
        clock.tick(60)

    # Пауза в конце периода
    pygame.time.wait(5000)

countdown_timer(25)  # Здесь можно указать желаемое количество минут