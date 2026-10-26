locals {
  images = {
    "noble-20261017" = {
      url      = "https://cloud-images.ubuntu.com/noble/20261017/noble-server-cloudimg-amd64.img"
      checksum = "04e8f2461a16a44e78a370284471f29616cdd9baf1893df25807b71f985b6c94"
    }
  }
}

resource "proxmox_download_file" "image" {
  for_each = local.images

  content_type = "import"
  datastore_id = "local"
  node_name    = var.node_name

  url       = each.value.url
  file_name = "${each.key}.qcow2"

  checksum           = each.value.checksum
  checksum_algorithm = "sha256"
}