variable "name" {
  description = "Proxmox VM name"
  type        = string
}

variable "vm_id" {
  description = "Proxmox VM id"
  type        = number
}

variable "ipv4_cidr" {
  description = "Proxmox VM іtatic IPv4 address with prefix"
  type        = string
}

variable "gateway" {
  description = "Router's IP"
  type        = string
}

variable "image_file_id" {
  description = "Proxmox image file ID from proxmox-shared"
  type        = string
}

variable "ssh_public_key" {
  description = "SSH public key"
  type        = string
}

variable "cores" {
  description = "Number of VM cores"
  type        = number
  default     = 2
}

variable "memory_mb" {
  description = "VM RAM"
  type        = number
  default     = 2048
}

variable "disk_gb" {
  description = "VM disk"
  type        = number
  default     = 20
}

variable "tags" {
  description = "For inventory grouping"
  type        = list(string)
  default     = []
}

variable "node_name" {
  description = "Node name"
  type        = string
  default     = "pve"
}

variable "datastore_id" {
  description = "Datastore ID"
  type        = string
  default     = "local-lvm"
}

variable "bridge" {
  description = "Bridge"
  type        = string
  default     = "vmbr0"
}