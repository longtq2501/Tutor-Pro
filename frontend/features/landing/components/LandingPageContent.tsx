import React from 'react';
import { Hero } from './home/Hero';
import { FlowIntro } from './home/FlowIntro';
import { StepFlow } from './home/StepFlow';
import { STEP_DATA } from './home/stepFlowData';
import { FeatureGrid } from './home/FeatureGrid';
import { FinalCTA } from './home/FinalCTA';

export default function LandingPageContent() {
    return (
        <main>
            <Hero />
            <FlowIntro steps={STEP_DATA} />
            <StepFlow />
            <FeatureGrid />
            <FinalCTA />
        </main>
    );
}
