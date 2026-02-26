
/*
  ==============================================================================
    EnvMaster Core Pro - Dual-Stage JUCE Implementation
    Featuring separate Mixing and Mastering chains.
  ==============================================================================
*/

#include <JuceHeader.h>

class EnvMasterProProcessor : public juce::AudioProcessor
{
public:
    EnvMasterProProcessor() : AudioProcessor (BusesProperties().withInput ("Input", juce::AudioChannelSet::stereo(), true)
                                                        .withOutput ("Output", juce::AudioChannelSet::stereo(), true))
    {}

    void prepareToPlay (double sampleRate, int samplesPerBlock) override
    {
        juce::dsp::ProcessSpec spec { sampleRate, (juce::uint32) samplesPerBlock, 2 };
        
        // MIX CHAIN
        mixComp.prepare(spec);
        mixDelay.prepare(spec);
        mixReverb.prepare(spec);
        
        // MASTER CHAIN
        masterComp.prepare(spec);
        masterLimiter.prepare(spec);
        masterLimiter.setThreshold(-0.1f);
    }

    void processBlock (juce::AudioBuffer<float>& buffer, juce::MidiBuffer& midiMessages) override
    {
        juce::dsp::AudioBlock<float> block(buffer);
        juce::dsp::ProcessContextReplacing<float> context(block);

        // STAGE 1: MIXING
        // (Iterative EQ, Compression, Delay)
        mixComp.process(context);
        
        // STAGE 2: MASTERING
        // (3-Band EQ, Glue Comp, Saturation)
        masterComp.process(context);
        
        // STAGE 3: ENVIRONMENT
        // Convolver processing...
        
        // STAGE 4: LIMITING
        masterLimiter.process(context);
    }

    // Boiling plate...
    const juce::String getName() const override { return "EnvMaster Pro v2"; }
    bool hasEditor() const override { return true; }
    juce::AudioProcessorEditor* createEditor() override { return nullptr; }
    void getStateInformation (juce::MemoryBlock& destData) override {}
    void setStateInformation (const void* data, int sizeInBytes) override {}

private:
    // Mixing Stage
    juce::dsp::Compressor<float> mixComp;
    juce::dsp::DelayLine<float> mixDelay { 96000 };
    juce::dsp::Reverb mixReverb;

    // Mastering Stage
    juce::dsp::Compressor<float> masterComp;
    juce::dsp::Limiter<float> masterLimiter;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (EnvMasterProProcessor)
};
