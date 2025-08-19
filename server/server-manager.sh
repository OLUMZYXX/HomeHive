#!/bin/bash

# HomeHive Server Management Script
# Usage: ./server-manager.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default port
DEFAULT_PORT=3001

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    print_status "Checking port $port..."
    
    if check_port $port; then
        print_warning "Port $port is in use. Killing process..."
        npx kill-port $port || {
            print_error "Failed to kill process on port $port"
            # Alternative method using lsof and kill
            local pid=$(lsof -ti:$port)
            if [ ! -z "$pid" ]; then
                kill -9 $pid
                print_success "Killed process $pid on port $port"
            fi
        }
        sleep 2
    else
        print_success "Port $port is free"
    fi
}

# Function to start development server
start_dev() {
    print_status "Starting HomeHive API Server in development mode..."
    kill_port $DEFAULT_PORT
    
    if command -v nodemon >/dev/null 2>&1; then
        print_status "Using nodemon for development..."
        npm run dev:nodemon
    else
        print_status "Using Node.js built-in watch mode..."
        npm run dev
    fi
}

# Function to start production server
start_prod() {
    print_status "Starting HomeHive API Server in production mode..."
    kill_port $DEFAULT_PORT
    
    if command -v pm2 >/dev/null 2>&1; then
        print_status "Using PM2 for production..."
        npm run pm2:start
    else
        print_warning "PM2 not found. Starting with Node.js..."
        npm run server:prod
    fi
}

# Function to stop server
stop_server() {
    print_status "Stopping HomeHive API Server..."
    
    if command -v pm2 >/dev/null 2>&1; then
        pm2 stop homehive-api 2>/dev/null || true
        pm2 delete homehive-api 2>/dev/null || true
    fi
    
    kill_port $DEFAULT_PORT
    print_success "Server stopped"
}

# Function to restart server
restart_server() {
    print_status "Restarting HomeHive API Server..."
    stop_server
    sleep 2
    start_dev
}

# Function to check server health
health_check() {
    print_status "Checking server health..."
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$DEFAULT_PORT/api/health 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ]; then
        print_success "Server is healthy (HTTP 200)"
        curl -s http://localhost:$DEFAULT_PORT/api/health | jq '.' 2>/dev/null || curl -s http://localhost:$DEFAULT_PORT/api/health
    else
        print_error "Server is not responding (HTTP $response)"
        return 1
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing server logs..."
    
    if command -v pm2 >/dev/null 2>&1; then
        pm2 logs homehive-api --lines 50
    else
        print_warning "PM2 not found. No logs available for direct node execution."
    fi
}

# Function to install dependencies
install_deps() {
    print_status "Installing/updating dependencies..."
    npm install
    
    # Install global tools if not present
    if ! command -v nodemon >/dev/null 2>&1; then
        print_status "Installing nodemon globally..."
        npm install -g nodemon
    fi
    
    if ! command -v pm2 >/dev/null 2>&1; then
        print_status "Installing PM2 globally..."
        npm install -g pm2
    fi
    
    print_success "Dependencies installed"
}

# Function to show server status
status() {
    print_status "HomeHive API Server Status:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Check port status
    if check_port $DEFAULT_PORT; then
        print_success "Port $DEFAULT_PORT: IN USE"
    else
        print_warning "Port $DEFAULT_PORT: FREE"
    fi
    
    # Check PM2 status
    if command -v pm2 >/dev/null 2>&1; then
        print_status "PM2 Status:"
        pm2 list | grep homehive-api || print_warning "No PM2 process found"
    fi
    
    # Try health check
    health_check || true
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Main script logic
case "$1" in
    "start"|"dev")
        start_dev
        ;;
    "start:prod"|"prod")
        start_prod
        ;;
    "stop")
        stop_server
        ;;
    "restart")
        restart_server
        ;;
    "health"|"check")
        health_check
        ;;
    "logs")
        show_logs
        ;;
    "install")
        install_deps
        ;;
    "status")
        status
        ;;
    "clean")
        kill_port $DEFAULT_PORT
        ;;
    *)
        echo "🏠 HomeHive API Server Manager"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  start, dev     Start development server"
        echo "  prod           Start production server" 
        echo "  stop           Stop server"
        echo "  restart        Restart server"
        echo "  health, check  Check server health"
        echo "  logs           Show server logs"
        echo "  install        Install/update dependencies"
        echo "  status         Show server status"
        echo "  clean          Kill processes on default port"
        echo ""
        echo "Examples:"
        echo "  $0 start       # Start development server"
        echo "  $0 health      # Check if server is running"
        echo "  $0 restart     # Restart the server"
        ;;
esac
