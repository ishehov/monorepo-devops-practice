# Monorepo architecture

This repository demonstrates a 3-tier-deployment (for now) architecture running a Node.js application via local containers, a fully provisioned host-based Virtual Machine (Dev env) and K3s cluster of one control and two worker nodes (Test env).

### Application Stack

* Frontend: Node.js / Express (UI and API proxy)
* API Gateway: Node.js / Express (Endpoints and DB access)
* Database: MySQL 8.0

### Local development - Docker Compose
<ul>

A fully containerized environment optimized for fast local iteration.

**Stack:** Docker Compose manages the frontend, API, and database containers.  
**Networking:** Internal Docker network utilizing service discovery (api-gateway, mysql).  
**State:** Data persists across rebuilds via the mysql_data named volume.  
**Access:** http://localhost:8080 (Frontend) and http://localhost:3000 (API).  
**Usage:** ```docker compose up -d --build```
</ul>

### Dev environment - Proxmox VM

<ul>

A host-based deployment running natively on an Ubuntu 24.04 VM, demonstrating infrastructure-as-code and configuration management.

**Terraform:** Declares and provisions the VM infrastructure on Proxmox VE.  
**Cloud-Init:** Bootstraps the guest OS, creates the devops user, and establishes SSH access.  
**Ansible:** Configures the OS, installs Node.js/MySQL/Nginx, and sets up systemd services.  
**Process management:** Application components run as unprivileged systemd services bound to loopback interfaces (127.0.0.1).  
**Routing:** Nginx listens on port 80 and acts as a reverse proxy, forwarding requests to the internal frontend and API ports.

</ul>

### Test environment — Proxmox VE / K3s

<ul>

A Kubernetes-based environment deployed on dedicated Ubuntu 24.04 VMs.

**Orchestration:** A three-node K3s cluster consisting of one control-plane node and two worker nodes.  
**Networking:** Traefik provides ingress capabilities; CoreDNS provides cluster DNS and service discovery.  
**System services:** CoreDNS, Traefik, Metrics Server, and the local-path storage provisioner are deployed and running.  
**Storage:** The local-path provisioner is available for node-local persistent volumes.

**Current state:** Infrastructure provisioning and Kubernetes installation are complete. Application deployment, end-to-end ingress validation, and application-level health checks remain planned.

</ul>