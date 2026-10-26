output "image_ids" {
  description = "Proxmox file IDs of base images, keyed by image name"
  value       = { for k, img in proxmox_download_file.image : k => img.id }
}