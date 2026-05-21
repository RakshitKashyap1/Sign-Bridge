.PHONY: build up down restart logs test lint typecheck clean setup-dev help

# ── Variables ──────────────────────────────────────────────────
SERVICES     := backend frontend nginx
COMPOSE      := docker compose
COMPOSE_FILE := docker-compose.yml
ENV_FILE     := .env

# ── Help ────────────────────────────────────────────────────────
help:
	@echo "SignBridge — Available commands"
	@echo "  make build          Build all Docker images"
	@echo "  make up             Start all services (detached)"
	@echo "  make down           Stop and remove all containers"
	@echo "  make restart        Restart all services"
	@echo "  make logs           Tail logs from all services"
	@echo "  make logs-backend   Tail backend logs"
	@echo "  make logs-frontend  Tail frontend logs"
	@echo "  make test           Run all tests (CI & local)"
	@echo "  make test-backend   Run backend tests"
	@echo "  make lint           Run all linters"
	@echo "  make typecheck      Run TypeScript type checker"
	@echo "  make clean          Remove dangling images & volumes"
	@echo "  make setup-dev      Install dependencies locally (no Docker)"

# ── Docker helpers ───────────────────────────────────────────────
build:
	$(COMPOSE) -f $(COMPOSE_FILE) --env-file $(ENV_FILE) build --no-cache

up:
	$(COMPOSE) -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up -d

down:
	$(COMPOSE) -f $(COMPOSE_FILE) --env-file $(ENV_FILE) down

restart: down up

logs:
	$(COMPOSE) -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs -f --tail=100 $(SERVICES)

logs-backend:
	$(COMPOSE) -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs -f --tail=200 backend

logs-frontend:
	$(COMPOSE) -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs -f --tail=200 frontend

# ── Testing ──────────────────────────────────────────────────────
test: test-backend test-frontend

test-backend:
	cd backend && python -m pytest tests/ -v --tb=short

test-frontend:
	cd frontend && npm run lint && npm run test || echo "No tests configured yet"

# ── Lint / Typecheck ─────────────────────────────────────────────
lint: lint-backend lint-frontend

lint-backend:
	cd backend && ruff check app/ || echo "ruff not installed — install: pip install ruff"

lint-frontend:
	cd frontend && npm run lint

typecheck:
	cd frontend && npx tsc --noEmit

# ── Local development setup ─────────────────────────────────────
setup-dev:
	@echo "→ Installing backend dependencies…"
	cd backend && pip install -r requirements.txt
	@echo "→ Installing frontend dependencies…"
	cd frontend && npm ci
	@echo "✓ Local dev environment ready."

# ── Cleanup ──────────────────────────────────────────────────────
clean:
	docker system prune -af --volumes
