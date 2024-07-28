# src/ui.py
import pygame
from pygame.locals import QUIT, MOUSEBUTTONDOWN
from elements import ELEMENTS, ElementType
from physics import Grid

# Initialize Pygame
pygame.init()

# Screen dimensions
WIDTH, HEIGHT = 800, 600
CELL_SIZE = 10
GRID_WIDTH = WIDTH // CELL_SIZE
GRID_HEIGHT = HEIGHT // CELL_SIZE
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Particle Simulator")

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Grid
grid = Grid(GRID_WIDTH, GRID_HEIGHT)

# Font for UI
font = pygame.font.Font(None, 36)

# Function to draw grid
def draw_grid(screen, grid):
    for x in range(grid.width):
        for y in range(grid.height):
            element_type = grid.get_element(x, y)
            color = ELEMENTS[element_type].color
            pygame.draw.rect(screen, color, (x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE))

# Function to open particle menu and select an element type
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
        "Steam": (50, 180, ElementType.STEAM),
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

# Main UI loop
def main():
    running = True
    current_element = ElementType.POWDER  # Initialize current_element

    while running:
        for event in pygame.event.get():
            if event.type == QUIT:
                running = False
            elif event.type == MOUSEBUTTONDOWN:
                if event.button == 1:  # Left click
                    pos = event.pos
                    grid_x = pos[0] // CELL_SIZE
                    grid_y = pos[1] // CELL_SIZE
                    grid.set_element(grid_x, grid_y, current_element)
                elif event.button == 3:  # Right click to open particle type menu
                    selected_element = open_particle_menu()
                    if selected_element is not None:
                        current_element = selected_element
                    pygame.display.set_mode((WIDTH, HEIGHT))  # Reset the main window size

        # Update grid
        grid.update()

        # Draw everything
        screen.fill(WHITE)
        draw_grid(screen, grid)

        # Display current element
        type_text = font.render(f'Current Element: {current_element.name}', True, BLACK)
        screen.blit(type_text, (10, 10))

        pygame.display.flip()

    pygame.quit()

if __name__ == '__main__':
    main()
