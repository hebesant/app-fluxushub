"use client";

import { Card } from "@/components/ui/card";
import { type SettingsTab, settingsTabs } from "./settingsShared";

export function SettingsSidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}) {
  return (
    <Card className="self-start border-border/70 bg-card/92 p-3 backdrop-blur dark:border-white/10 dark:bg-white/8">
      <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-lg border px-3 py-3 text-left transition ${
                isActive
                  ? "border-primary-500 bg-primary-500/10 text-primary-700 dark:text-primary-100"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground dark:hover:border-white/10 dark:hover:bg-white/8 dark:hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <Icon className="size-4" />
                {tab.label}
              </span>
              <span className="mt-1 block text-xs leading-5">
                {tab.description}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
