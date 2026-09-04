.PHONY: help install start dev build test check-types lint format clean clean-build

# Default target
help:
	@echo "Infotrygd-The-Final-Countdown - Makefile targets"
	@echo ""
	@echo "Setup:"
	@echo "  make install        Install dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make start          Start dev-server (port 3000)"
	@echo "  make dev            Alias for 'make start'"
	@echo ""
	@echo "Building:"
	@echo "  make build          Build for production"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test           Run tests with Vitest"
	@echo "  make check-types    Type-check with tsc --noEmit"
	@echo "  make lint           Check code with ESLint"
	@echo "  make format         Format code with Prettier"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean          Remove node_modules and dist"
	@echo "  make clean-build    Remove build artifacts only"
	@echo ""

# Setup targets
install:
	cd frontend && pnpm install

# Development targets
start:
	cd frontend && pnpm dev

dev: start

# Build targets
build:
	cd frontend && pnpm build

# Testing & Quality targets
test:
	cd frontend && pnpm test

check-types:
	cd frontend && pnpm check-types

lint:
	cd frontend && pnpm lint

format:
	cd frontend && pnpm format

# Cleanup targets
clean:
	cd frontend && rm -rf node_modules dist .vite

clean-build:
	cd frontend && rm -rf dist .vite

# Convenience targets
all: install build
	@echo "✓ Project built successfully"

setup: install
	@echo "✓ Dependencies installed"
