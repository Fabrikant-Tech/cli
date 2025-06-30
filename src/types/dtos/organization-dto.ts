import type { EntityDto } from './entity-dto.js';

interface OrganizationDto extends EntityDto {
  name: string;
  namespace: string;
  prefix: string;
}

export type { OrganizationDto };
