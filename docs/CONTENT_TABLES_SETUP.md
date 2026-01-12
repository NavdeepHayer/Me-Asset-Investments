# Content Tables Setup

Run this SQL in Supabase SQL Editor to set up RLS policies and seed data.

## 1. RLS Policies

```sql
-- Enable RLS on all content tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- PROJECTS: Anyone can read, admins can write
CREATE POLICY "Anyone can read projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- SITE_CONTENT: Anyone can read, admins can write
CREATE POLICY "Anyone can read site_content"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site_content"
  ON public.site_content FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update site_content"
  ON public.site_content FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete site_content"
  ON public.site_content FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- TEAM_MEMBERS: Anyone can read, admins can write
CREATE POLICY "Anyone can read team_members"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert team_members"
  ON public.team_members FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update team_members"
  ON public.team_members FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete team_members"
  ON public.team_members FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );
```

## 2. Seed Projects Data

```sql
INSERT INTO public.projects (name, location, type, status, description, image, display_order, visible) VALUES
('Premier Inn, Swansea', 'Swansea, Wales', '132-Bed Hotel', 'Current', 'Full facade remediation including render, aluminium cladding, brick, and insulation. Project value: £5.3m', '/images/projects/swansea.jpeg', 1, true),
('Skyline Chambers', 'Manchester', 'Residential Development', 'Current', '16-month facade remediation project including render, aluminium cladding, and fire rated windows. Project value: £8.5m', '/images/projects/skyline-chambers.jpeg', 2, true),
('O Central', 'London, Southwark', 'Residential Development', 'Current', '12-month facade remediation with new render, aluminium cladding, and firestopping. Project value: £6.4m', '/images/projects/o-central.jpeg', 3, true),
('Celestial House', 'London, Tower Hamlets', 'Residential Development', 'Completed', 'Full facade remediation completed in 11 months. Project value: £5.1m', '/images/projects/celestial-house.jpeg', 4, true),
('The Interchange', 'Croydon', 'Residential Development', 'Completed', 'Facade remediation completed in 10 months including new render and insulation. Project value: £5.0m', '/images/projects/the-interchange.jpeg', 5, true),
('Falcondale Court', 'Park Royal, London', 'Residential Development', 'Completed', '11-month remediation project with new spandrel panels and zinc cladding. Project value: £4.5m', '/images/projects/falcondale-court.jpeg', 6, true),
('Landmark', 'Bexhill-on-Sea', 'Residential Development', 'Completed', 'Full facade remediation completed in 11 months. Project value: £4.9m', '/images/projects/landmark.jpeg', 7, true),
('Century Tower', 'Chelmsford', 'Residential Development', 'Completed', 'Facade remediation completed June 2022 with new aluminium cladding and balustrades. Project value: £3.1m', '/images/projects/century-tower.jpeg', 8, true),
('Burton Place', 'Manchester', 'Residential Development', 'Completed', '12-month major remediation with new SFS stud system and aluminium cladding. Project value: £14.7m', '/images/projects/burton-place.jpeg', 9, true);
```

## 3. Seed Site Content Data

```sql
INSERT INTO public.site_content (id, content) VALUES
('intro', 'ME | Asset Management is a discretionary investment firm focused on acquiring, enhancing, and managing income-producing real estate assets. We take a hands-on approach to value creation, working closely with our partners to unlock the full potential of every property in our portfolio.'),
('investmentFocus', 'Our investment platform spans hotels, student housing, offices, and other income-generating properties. We identify undervalued assets with strong fundamentals and apply our expertise to drive sustainable returns for our investors.'),
('savePhilosophy', 'Through our SAVE approach – Stranded Assets Value Enhancement – we specialize in repositioning properties that have been overlooked or underperforming. By integrating ESG principles and asset improvement strategies, we transform these opportunities into high-performing investments.'),
('approach', 'Our multi-strategy platform operates across three core areas: acquiring and holding quality assets for long-term income, identifying remediation opportunities to unlock hidden value, and selectively pursuing undervalued secondary market opportunities.'),
('mission', 'We are committed to responsible investing and sustainable value creation. Our focus on Environmental, Social, and Governance principles ensures that our investments deliver returns while contributing positively to communities and the environment.'),
('footer_copyright', 'ME | Asset Management'),
('footer_contact_email', 'verender@meassetmanagement.com'),
('footer_contact_person', 'Verender Badial');
```

## 4. Seed Team Members Data

```sql
INSERT INTO public.team_members (name, role, bio, display_order, visible) VALUES
('Paul Thandi', 'Chairman', 'Paul is a Private Equity investor, Board Member and the former CEO and Chairman of the NEC Group (Birmingham), successfully growing the NEC over 15 years to a $1 Billion exit to Blackstone in 2018. Paul is also Chairman of BOXPARK, Chairman of Student Energy Group, Sostratus Energy, Just Ask A Question (JAAQ) and is a patron of Marie Curie and Heads Together.', 1, true),
('Verender S. Badial', 'CEO', 'Strategic advisor and former investment banker with over 20 years'' leadership in global capital markets, track record spanning technology and large-scale real estate consistently scaled high-growth ventures and delivered long-term shareholder value. Since 2015, funded and developed over £150 million across 500,000 sq ft of UK real estate. He is Co-Founder, Sponsor, and CFO of JATT Acquisition Corp, a New York listed SPAC, and a key architect in ~US$300 million of Nasdaq fundraising, and fund investments across biotech, technology, and real estate. Away from business, Verender volunteers as Director for a college in North India offering science and nursing studies to women and girls.', 2, true),
('Tarvy Gosal & Jas Randhawa', 'Managing Directors, Fleetwood Architectural Aluminium', 'Tarvy holds a degree in Civil Engineering and brings over two decades of senior leadership experience in the construction sector. After early career roles with a range of construction companies, he co-founded Fleetwood Architectural Aluminium Limited in 2003 and has served as Managing Director since inception. Under his stewardship, FAA has developed into a nationally operating specialist building envelope contractor with annual revenues of approximately £40 million. Tarvy has also invested in a number of early-stage businesses.', 3, true),
('Michael Mirelman & Daniel Benton', 'Directors, GRE Capital', 'Each having had 20+ years'' experience working across the finance, banking, and real estate sectors, and alongside property developers, investors, and family offices. Recently, both have led over £150+ million real estate finance, development and portfolio management.', 4, true);
```
