resource "proxmox_download_file" "ubuntu_cloud_image" {
  content_type = "import"
  datastore_id = "local"

  node_name = "pve"

  url = "https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img"

  file_name = "noble-server-cloudimg-amd64.qcow2"
}

resource "proxmox_virtual_environment_vm" "dev" {
  name      = "dev-01"
  node_name = "pve"
  vm_id     = 700

  cpu {
    cores = 2
  }

  memory {
    dedicated = 2048
  }

  disk {
    datastore_id = "local-lvm"
    file_format  = "raw"
    interface    = "scsi0"
    size         = 20
    import_from  = proxmox_download_file.ubuntu_cloud_image.id
  }

  network_device {
    bridge = "vmbr0"
  }

  initialization {
    datastore_id = "local-lvm"

    user_account {
      username = "devops"
      keys     = [file("~/.ssh/id_ed25519.pub")]
    }

    ip_config {
      ipv4 {
        address = "dhcp"
      }
    }
  }

  boot_order = ["scsi0"]
}