locals {
  test_nodes = {
    test_cp_01 = {
      name   = "test-cp-01"
      vm_id  = 800
      ip     = "192.168.1.200/24"
      memory = 2048
      disk   = 20
    }

    test_worker_01 = {
      name   = "test-worker-01"
      vm_id  = 801
      ip     = "192.168.1.201/24"
      memory = 4096
      disk   = 30
    }

    test_worker_02 = {
      name   = "test-worker-02"
      vm_id  = 802
      ip     = "192.168.1.202/24"
      memory = 4096
      disk   = 30
    }
  }
}

resource "proxmox_virtual_environment_vm" "test" {
  for_each = local.test_nodes

  name      = each.value.name
  node_name = "pve"
  vm_id     = each.value.vm_id

  on_boot = true

  cpu {
    cores = 2
  }

  memory {
    dedicated = each.value.memory
  }

  disk {
    datastore_id = "local-lvm"
    file_format  = "raw"
    interface    = "scsi0"
    size         = each.value.disk

    # Reuse the image owned by the DEV Terraform root.
    # TEST does not manage the image-download resource.
    import_from = "local:import/noble-server-cloudimg-amd64.qcow2"
  }

  network_device {
    bridge = "vmbr0"
  }

  initialization {
    datastore_id = "local-lvm"

    user_account {
      username = "devops"
      keys     = [file(pathexpand("~/.ssh/id_ed25519.pub"))]
    }

    ip_config {
      ipv4 {
        address = each.value.ip
        gateway = "192.168.1.1"
      }
    }
  }

  boot_order = ["scsi0"]
}