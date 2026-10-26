locals {
  image_file_id  = "local:import/noble-20240423.img"
  gateway        = "192.168.1.1"
  ssh_public_key = file("~/.ssh/id_ed25519.pub")

  nodes = {
    dev-01 = {
      vm_id     = 210
      ip        = "192.168.1.210/24"
      memory_mb = 4096
      disk_gb   = 20
      role      = "k3s-server"
    }
  }
}

module "node" {
  source   = "../../modules/proxmox-vm"
  for_each = local.nodes

  name      = each.key
  vm_id     = each.value.vm_id
  ipv4_cidr = each.value.ip
  memory_mb = each.value.memory_mb
  disk_gb   = each.value.disk_gb

  gateway        = local.gateway
  image_file_id  = local.image_file_id
  ssh_public_key = local.ssh_public_key

  tags = sort(["devops", each.value.role])
}