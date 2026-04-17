import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function formatPriceKRW(value) {
  return new Intl.NumberFormat('ko-KR').format(value || 0);
}

export default function SubscriptionCard({
  subscription,
  loading,
  onOpenUpgradeModal,
  onManagePayment,
  onChangePlan,
  onRequestCancel,
}) {
  const { t } = useTranslation();
  const isPremium = subscription?.plan === 'premium';

  if (!isPremium) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
        <p className="font-black text-slate-900">{t('settings.subscription.freePlan')}</p>
        <p className="text-sm text-slate-500">{t('settings.subscription.freeDesc')}</p>
        <button
          type="button"
          onClick={onOpenUpgradeModal}
          disabled={loading}
          className="w-full rounded-2xl py-3 bg-gradient-to-r from-[#FF1F8E] to-violet-600 text-white font-bold"
        >
          {t('settings.subscription.upgrade')}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-black text-slate-900 flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" />
          {t('settings.subscription.premiumPlan')}
        </p>
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">{t('settings.subscription.active')}</span>
      </div>
      <p className="text-sm text-slate-600">
        {t('settings.subscription.nextBilling')}: {subscription?.nextBillingDate || '-'} / ₩{formatPriceKRW(subscription?.monthlyPrice)}/month
      </p>
      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={onManagePayment} className="rounded-xl border border-slate-300 py-2 text-xs font-semibold">
          {t('settings.subscription.changePayment')}
        </button>
        <button type="button" onClick={onChangePlan} className="rounded-xl border border-slate-300 py-2 text-xs font-semibold">
          {t('settings.subscription.changePlan')}
        </button>
        <button type="button" onClick={onRequestCancel} className="rounded-xl border border-rose-300 text-rose-600 py-2 text-xs font-semibold">
          {t('settings.subscription.cancel')}
        </button>
      </div>
    </div>
  );
}
