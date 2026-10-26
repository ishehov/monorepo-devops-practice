output "name" {
  description = "The name of the virtual machine"
  value       = proxmox_virtual_environment_vm.this.name
}

output "vm_id" {
  description = "The VM ID in Proxmox"
  value       = proxmox_virtual_environment_vm.this.vm_id
}

output "ipv4_address" {
  description = "Clean IPv4 address for Ansible"
  value       = split("/", proxmox_virtual_environment_vm.this.initialization[0].ip_config[0].ipv4[0].address)[0]
}