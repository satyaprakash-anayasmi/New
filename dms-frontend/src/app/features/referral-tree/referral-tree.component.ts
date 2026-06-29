import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { ReferralNode } from '../../shared/models/user.model';
import { ToastService } from '../../core/services/toast.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-referral-tree',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './referral-tree.component.html',
  styleUrl: './referral-tree.component.css'
})
export class ReferralTreeComponent implements OnInit {
  isLoading = true;
  isAdmin = false;

  // Single root node — same structure for both admin and user views
  rootNode: ReferralNode | null = null;

  expandedNodes = new Set<number>();
  searchTerm = '';
  isSearching = false;
  searchResults: any[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly toast: ToastService
  ) {}

  ngOnInit() {
    this.detectRole();
    this.loadTree();
  }

  detectRole() {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roles: string[] = (payload.roles || []).map((r: any) => r.authority || r);
        this.isAdmin = roles.includes('ROLE_ADMIN');
      } catch {}
    }
  }

  loadTree() {
    this.isLoading = true;
    const obs = this.isAdmin
      ? this.userService.getFullReferralTree()
      : this.userService.getMyReferralTree();

    obs.subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          this.rootNode = res.data as ReferralNode;
          if (this.rootNode) {
            this.expandedNodes.add(this.rootNode.userId);
          }
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error?.message || 'Failed to load referral tree';
        this.toast.showError(msg);
      }
    });
  }

  onSearch() {
    if (!this.searchTerm || !this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }
    this.isSearching = true;
    this.userService.searchReferralTree(this.searchTerm.trim()).subscribe({
      next: (res) => {
        this.isSearching = false;
        if (res.success) {
          this.searchResults = res.data || [];
        } else {
          this.searchResults = [];
        }
      },
      error: () => {
        this.isSearching = false;
        this.toast.showError('Search failed');
      }
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchResults = [];
  }

  toggleNode(nodeId: number) {
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }
  }

  isExpanded(nodeId: number): boolean {
    return this.expandedNodes.has(nodeId);
  }

  expandAll(nodes: ReferralNode[]) {
    nodes.forEach(n => {
      this.expandedNodes.add(n.userId);
      if (n.children?.length) this.expandAll(n.children);
    });
  }

  collapseAll() {
    this.expandedNodes.clear();
    if (this.rootNode) {
      this.expandedNodes.add(this.rootNode.userId);
    }
  }

  isPaid(node: ReferralNode): boolean {
    return node.paymentStatus === 'COMPLETED' || node.paymentStatus === 'PAID';
  }
}
