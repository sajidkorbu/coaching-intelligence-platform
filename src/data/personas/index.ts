import { PersonaProfile } from '../../types';
import { mumbaiITProfessional } from './mumbai-it-professional';
import { delhiStartupFounder } from './delhi-startup-founder';
import { bangaloreProductManager } from './bangalore-product-manager';
import { mumbaiFinanceProfessional } from './mumbai-finance-professional';
import { delhiCorporateLawyer } from './delhi-corporate-lawyer';
import { bangaloreDataScientist } from './bangalore-data-scientist';
import { mumbaiMarketingManager } from './mumbai-marketing-manager';
import { delhiManagementConsultant } from './delhi-management-consultant';
import { bangaloreSoftwareArchitect } from './bangalore-software-architect';

export const personas: PersonaProfile[] = [
  // Original 3
  mumbaiITProfessional,
  delhiStartupFounder,
  bangaloreProductManager,
  
  // New 6 personas
  mumbaiFinanceProfessional,
  delhiCorporateLawyer, 
  bangaloreDataScientist,
  mumbaiMarketingManager,
  delhiManagementConsultant,
  bangaloreSoftwareArchitect
];

export const getPersonaById = (id: string): PersonaProfile | undefined => {
  return personas.find(persona => persona.id === id);
};

export const getPersonasByCity = (city: string): PersonaProfile[] => {
  return personas.filter(persona => persona.city === city);
};

export {
  mumbaiITProfessional,
  delhiStartupFounder,
  bangaloreProductManager,
  mumbaiFinanceProfessional,
  delhiCorporateLawyer,
  bangaloreDataScientist,
  mumbaiMarketingManager,
  delhiManagementConsultant,
  bangaloreSoftwareArchitect
};