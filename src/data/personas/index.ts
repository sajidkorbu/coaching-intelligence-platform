import { PersonaProfile } from '../../types';
// Metro city personas (existing)
import { mumbaiITProfessional } from './mumbai-it-professional';
import { delhiStartupFounder } from './delhi-startup-founder';
import { bangaloreProductManager } from './bangalore-product-manager';
import { mumbaiFinanceProfessional } from './mumbai-finance-professional';
import { delhiCorporateLawyer } from './delhi-corporate-lawyer';
import { bangaloreDataScientist } from './bangalore-data-scientist';
import { mumbaiMarketingManager } from './mumbai-marketing-manager';
import { delhiManagementConsultant } from './delhi-management-consultant';
import { bangaloreSoftwareArchitect } from './bangalore-software-architect';

// Second-tier city personas (new)
import { puneSoftwareEngineer } from './pune-software-engineer';
import { hyderabadDigitalMarketing } from './hyderabad-digital-marketing';
import { chennaiFinanceAnalyst } from './chennai-finance-analyst';
import { ahmedabadManufacturing } from './ahmedabad-manufacturing';
import { kolkataFinancialServices } from './kolkata-financial-services';
import { jaipurSalesManager } from './jaipur-sales-manager';
import { bhubaneswarGovernment } from './bhubaneswar-government';
import { lucknowHealthcare } from './lucknow-healthcare';
import { indoreTextileBusiness } from './indore-textile-business';
import { chandigarhEdTechStartup } from './chandigarh-edtech-startup';

export const personas: PersonaProfile[] = [
  // Metro city personas (Mumbai, Delhi, Bangalore)
  mumbaiITProfessional,
  delhiStartupFounder,
  bangaloreProductManager,
  mumbaiFinanceProfessional,
  delhiCorporateLawyer, 
  bangaloreDataScientist,
  mumbaiMarketingManager,
  delhiManagementConsultant,
  bangaloreSoftwareArchitect,
  
  // Second-tier city personas
  puneSoftwareEngineer,
  hyderabadDigitalMarketing,
  chennaiFinanceAnalyst,
  ahmedabadManufacturing,
  kolkataFinancialServices,
  jaipurSalesManager,
  bhubaneswarGovernment,
  lucknowHealthcare,
  indoreTextileBusiness,
  chandigarhEdTechStartup
];

export const getPersonaById = (id: string): PersonaProfile | undefined => {
  return personas.find(persona => persona.id === id);
};

export const getPersonasByCity = (city: string): PersonaProfile[] => {
  return personas.filter(persona => persona.city === city);
};

export {
  // Metro city personas
  mumbaiITProfessional,
  delhiStartupFounder,
  bangaloreProductManager,
  mumbaiFinanceProfessional,
  delhiCorporateLawyer,
  bangaloreDataScientist,
  mumbaiMarketingManager,
  delhiManagementConsultant,
  bangaloreSoftwareArchitect,
  
  // Second-tier city personas
  puneSoftwareEngineer,
  hyderabadDigitalMarketing,
  chennaiFinanceAnalyst,
  ahmedabadManufacturing,
  kolkataFinancialServices,
  jaipurSalesManager,
  bhubaneswarGovernment,
  lucknowHealthcare,
  indoreTextileBusiness,
  chandigarhEdTechStartup
};
