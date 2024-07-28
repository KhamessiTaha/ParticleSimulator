# src/particle_menu.py
import pygame
from elements import ElementType

class ParticleMenu:
    def __init__(self):
        self.width = 200
        self.height = 200
        self.screen = pygame.display.set_mode((self.width, self.height))
        pygame.display.set_caption("Particle Type Menu")

        self.font = pygame.font.Font(None, 36)
        self.buttons = {
            "Empty": (50, 20, ElementType.EMPTY),
            "Powder": (50, 60, ElementType.POWDER),
            "Water": (50, 100, ElementType.WATER),
            "Fire": (50, 140, ElementType.FIRE),
        }

    def draw_buttons(self):
        self.screen.fill((255, 255, 255))
        for text, (x, y, element_type) in self.buttons.items():
            button = pygame.Rect(x, y, 100, 30)
            pygame.draw.rect(self.screen, (0, 0, 0), button, 2)
            label = self.font.render(text, True, (0, 0, 0))
            self.screen.blit(label, (x + 10, y + 5))
        pygame.display.flip()

    def get_selected_element_type(self, mouse_pos):
        for text, (x, y, element_type) in self.buttons.items():
            button = pygame.Rect(x, y, 100, 30)
            if button.collidepoint(mouse_pos):
                return element_type
        return None

def open_particle_menu():
    menu_width, menu_height = 200, 200
    menu_screen = pygame.display.set_mode((menu_width, menu_height))
    pygame.display.set_caption("Particle Type Menu")
    font = pygame.font.Font(None, 36)
    buttons = {
        "Empty": (50, 20, ElementType.EMPTY),
        "Powder": (50, 60, ElementType.POWDER),
        "Water": (50, 100, ElementType.WATER),
        "Fire": (50, 140, ElementType.FIRE),
    }

    def draw_buttons():
        menu_screen.fill((255, 255, 255))
        for text, (x, y, element_type) in buttons.items():
            button = pygame.Rect(x, y, 100, 30)
            pygame.draw.rect(menu_screen, (0, 0, 0), button, 2)
            label = font.render(text, True, (0, 0, 0))
            menu_screen.blit(label, (x + 10, y + 5))
        pygame.display.flip()

    draw_buttons()
    selected_type = None
    while selected_type is None:
        for event in pygame.event.get():
            if event.type == MOUSEBUTTONDOWN:
                selected_type = get_selected_element_type(event.pos, buttons)
            elif event.type == QUIT:
                pygame.quit()
                return None
    return selected_type

def get_selected_element_type(mouse_pos, buttons):
    for text, (x, y, element_type) in buttons.items():
        button = pygame.Rect(x, y, 100, 30)
        if button.collidepoint(mouse_pos):
            return element_type
    return None
