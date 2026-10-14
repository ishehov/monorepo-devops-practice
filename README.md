# Monorepo architecture

This repository demonstrates a dual-deployment (for now) architecture running a Node.js application via local containers and a fully provisioned host-based Virtual Machine.

### Application Stack

* Frontend: Node.js / Express (UI and API proxy)
* API Gateway: Node.js / Express (Endpoints and DB access)
* Database: MySQL 8.0

### Local development - Docker Compose
<div style="padding-left: 24px;">

A fully containerized environment optimized for fast local iteration.

**Stack:** Docker Compose manages the frontend, API, and database containers.

**Networking:** Internal Docker network utilizing service discovery (api-gateway, mysql).

**State:** Data persists across rebuilds via the mysql_data named volume.

**Access:** http://localhost:8080 (Frontend) and http://localhost:3000 (API).

**Usage:** ```docker compose up -d --build```

</div>

### Dev environment - Proxmox VM

<div style="padding-left: 24px;">

A host-based deployment running natively on an Ubuntu 24.04 VM, demonstrating infrastructure-as-code and configuration management.

**Terraform:** Declares and provisions the VM infrastructure on Proxmox VE.

**Cloud-Init:** Bootstraps the guest OS, creates the devops user, and establishes SSH access.

**Ansible:** Configures the OS, installs Node.js/MySQL/Nginx, and sets up systemd services.

**Process management:** Application components run as unprivileged systemd services bound to loopback interfaces (127.0.0.1).

**Routing:** Nginx listens on port 80 and acts as a reverse proxy, forwarding requests to the internal frontend and API ports.

</div>