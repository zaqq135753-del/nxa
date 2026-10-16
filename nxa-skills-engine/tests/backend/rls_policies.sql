-- Habilitação obrigatória de RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Política de isolamento multi-tenant estrito via JWT claims
CREATE POLICY tenant_isolation_policy ON projects
  FOR ALL
  USING (
    tenant_id = (auth.jwt() ->> 'org_id')::uuid
  )
  WITH CHECK (
    tenant_id = (auth.jwt() ->> 'org_id')::uuid
  );
