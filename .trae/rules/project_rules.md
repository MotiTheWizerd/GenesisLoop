---
inclusion: always
---

# Development Standards & Best Practices

## Code Organization

- Keep files small and focused (250-320 lines maximum)
- Split large files into smaller, reusable utilities and components
- Use clear, descriptive file and function names
- Organize code into logical modules and packages

## File Structure Guidelines

- **Utils**: Create utility functions in separate files (e.g., `utils/`, `helpers/`)
- **Components**: Break down complex functionality into reusable components
- **Models**: Keep data models in dedicated files
- **Config**: Centralize configuration in separate files
- **Module Organization**: When a module grows beyond one file, create a dedicated folder for it in the same location and move all related files into that folder

## Documentation Requirements

- Document all changes with clear commit messages
- Add docstrings to all functions and classes
- Include type hints for better code clarity
- Maintain README files for complex modules
- Comment complex logic and business rules

## Code Quality Standards

- Follow PEP 8 for Python code style
- Use meaningful variable and function names
- Implement proper error handling
- Write unit tests for new functionality
- Keep functions focused on single responsibilities
- Create test files for every module with corresponding test folder structure

## Refactoring Guidelines

- When a file exceeds 250-320 lines, split it immediately
- Extract common patterns into utility functions
- Create reusable components for repeated functionality
- When a module requires multiple files, create a dedicated folder in the same location and move all related files into it
- Maintain backward compatibility when refactoring

## Project Structure Best Practices

```
project/
├── modules/
│   └── module_name/
├── tests/
│   └── modules/
│       └── module_name/
├── utils/
├── config/
└── docs/
```

**Testing Structure Rule**: Every module must have a corresponding test folder that mirrors its structure:

- Module: `modules/reflect/` → Test: `tests/modules/reflect/`
- Module: `modules/analyze/handler.py` → Test: `tests/modules/analyze/test_handler.py`

Always prioritize maintainability, readability, and reusability in all code changes.
