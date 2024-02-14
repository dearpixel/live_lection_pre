import pygame
from pygame.locals import *

# Инициализация Pygame
pygame.init()

# Размеры окна
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Ежедневные заметки")

# Цвета
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GRAY = (150, 150, 150)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# Класс для кружков
class Circle:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.radius = 20
        self.color = GRAY
        self.selected = False

    def draw(self):
        pygame.draw.circle(screen, self.color, (self.x, self.y), self.radius)

    def toggle_select(self):
        if self.selected:
            self.selected = False
            self.color = GRAY
        else:
            self.selected = True
            self.color = BLUE

# Создание списка кружков
circles = [Circle(50 + i * 60, 50) for i in range(10)]

# Главный цикл программы
running = True
while running:
    screen.fill(WHITE)

    # Обработка событий
    for event in pygame.event.get():
        if event.type == QUIT:
            running = False
        elif event.type == MOUSEBUTTONDOWN:
            if event.button == 1:  # Левая кнопка мыши
                # Проверяем, было ли нажатие на кружок
                for circle in circles:
                    if circle.x - circle.radius < event.pos[0] < circle.x + circle.radius and \
                       circle.y - circle.radius < event.pos[1] < circle.y + circle.radius:
                        circle.toggle_select()
        elif event.type == KEYDOWN:
            if event.key == K_ESCAPE:
                running = False

    # Отрисовка кружков
    for circle in circles:
        circle.draw()

    # Отрисовка кнопки "+"
    pygame.draw.circle(screen, GREEN, (50 + len(circles) * 60, 50), 20)
    pygame.draw.line(screen, BLACK, (40 + len(circles) * 60, 50), (60 + len(circles) * 60, 50))
    pygame.draw.line(screen, BLACK, (50 + len(circles) * 60, 40), (50 + len(circles) * 60, 60))

    pygame.display.flip()

# Завершение работы Pygame
pygame.quit()