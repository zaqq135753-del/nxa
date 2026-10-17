import { ActivationOnboarding } from './ActivationOnboarding';
interface CaraivaMagicOnboardingExperienceProps {
  onClose?: () => void;
  onExploreMap?: () => void;
  onOpenDashboard?: () => void;
  inviteCode?: string;
  repName?: string;
}
// Public invite labels never grant ownership. Creation is bound to the authenticated account.
export function CaraivaMagicOnboardingExperience({ onClose }: CaraivaMagicOnboardingExperienceProps) {
  return <ActivationOnboarding onClose={onClose}/>;
}
