"use client";

import "./settings-list.scss";
import { useState } from "react";
import { toast } from "sonner";
import { Bell, LogOut, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

function SettingRow({
  icon: Icon,
  label,
  description,
  control,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  control: React.ReactNode;
}) {
  return (
    <div className="settings-list__row">
      <div className="settings-list__row-main">
        <span className="settings-list__icon">
          <Icon />
        </span>
        <div>
          <p className="settings-list__label">{label}</p>
          <p className="settings-list__description">{description}</p>
        </div>
      </div>
      {control}
    </div>
  );
}

export function SettingsList() {
  const [notifications, setNotifications] = useState(true);

  function handleSignOut() {
    toast("ログアウトしました（デモ表示のため実際には何も起こりません）");
  }

  return (
    <div className="settings-list">
      <SettingRow
        icon={Bell}
        label="試合前の通知"
        description="キックオフ前にプッシュ通知を受け取る"
        control={<Switch checked={notifications} onCheckedChange={setNotifications} />}
      />
      <SettingRow
        icon={ShieldCheck}
        label="アカウント設定"
        description="メールアドレス・パスワードの変更"
        control={
          <Button
            variant="ghost"
            size="sm"
            className="settings-list__action"
            onClick={() => toast("アカウント機能は近日公開予定です")}
          >
            変更する
          </Button>
        }
      />
      <SettingRow
        icon={LogOut}
        label="ログアウト"
        description="このデバイスからログアウトします"
        control={
          <Button
            variant="outline"
            size="sm"
            className="settings-list__action settings-list__action--danger"
            onClick={handleSignOut}
          >
            ログアウト
          </Button>
        }
      />
    </div>
  );
}
