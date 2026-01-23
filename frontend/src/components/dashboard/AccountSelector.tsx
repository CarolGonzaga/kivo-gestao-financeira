import { useState } from "react";
import { ChevronDown, Plus, Wallet } from "lucide-react";
import { Account, accountTypeIcons, accountTypeLabels } from "@/types/finance";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AccountSelectorProps {
  accounts: Account[];
  selectedAccount: Account | null;
  onSelectAccount: (account: Account) => void;
  onAddAccount: () => void;
  showAllOption?: boolean;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
}

export function AccountSelector({
  accounts,
  selectedAccount,
  onSelectAccount,
  onAddAccount,
  showAllOption = true,
  onSelectAll,
  isAllSelected = false,
}: AccountSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-12 px-4 bg-card border-border hover:bg-accent"
        >
          <div className="flex items-center gap-3">
            {isAllSelected ? (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Wallet className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Todas as contas</p>
                  <p className="text-xs text-muted-foreground">
                    {accounts.length} conta{accounts.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </>
            ) : selectedAccount ? (
              <>
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-lg"
                  style={{ backgroundColor: selectedAccount.color + "20" }}
                >
                  {accountTypeIcons[selectedAccount.type]}
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{selectedAccount.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {accountTypeLabels[selectedAccount.type]}
                  </p>
                </div>
              </>
            ) : (
              <span className="text-muted-foreground">Selecione uma conta</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[calc(100vw-2rem)] max-w-md bg-card border-border" align="start">
        {showAllOption && onSelectAll && (
          <>
            <DropdownMenuItem
              onClick={onSelectAll}
              className={`flex items-center gap-3 p-3 cursor-pointer ${
                isAllSelected ? "bg-accent" : ""
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Todas as contas</p>
                <p className="text-xs text-muted-foreground">
                  Visualizar saldo total
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            onClick={() => onSelectAccount(account)}
            className={`flex items-center gap-3 p-3 cursor-pointer ${
              selectedAccount?.id === account.id && !isAllSelected ? "bg-accent" : ""
            }`}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-lg"
              style={{ backgroundColor: account.color + "20" }}
            >
              {accountTypeIcons[account.type]}
            </div>
            <div className="flex-1">
              <p className="font-medium">{account.name}</p>
              <p className="text-xs text-muted-foreground">
                {accountTypeLabels[account.type]}
              </p>
            </div>
            <p className="font-semibold tabular-nums">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(account.balance)}
            </p>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onAddAccount}
          className="flex items-center gap-3 p-3 cursor-pointer text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Plus className="h-4 w-4" />
          </div>
          <p className="font-medium">Adicionar nova conta</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
