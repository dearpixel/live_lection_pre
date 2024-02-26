import pygame
import random

# Инициализация Pygame
pygame.init()

# Определение цветов
GRAY = (128, 128, 128)
BLUE = (0, 0, 255)
GREEN = (0, 255, 0)

# Размеры экрана
width, height = 1000, 600
screen = pygame.display.set_mode((width, height))

# Отображение блоков на карте
block_size = 50
bw, bh = 20, 20
for x in range(0, width, block_size):
    for y in range(0, height, block_size):
        block_type = random.choice(["wall", "water", "grass"])
        
        if block_type == "wall":
            color = GRAY
        elif block_type == "water":
            color = BLUE
        else:
            color = GREEN
        
        pygame.draw.rect(screen, color, (x, y, block_size, block_size))

# Отображение окна Pygame
pygame.display.flip()

# Основной игровой цикл
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

# Выход из Pygame
pygame.quit()