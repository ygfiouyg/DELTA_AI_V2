"""
Voice Profiles — V.103
خرائط العينات الصوتية الـ 5 لـ Edge TTS voices.
بدل ما نـ download 1.87GB model، بنستخدم Edge TTS بـ voices متناسبة مع كل نبرة.
"""

VOICE_PROFILES = {
    "neutral": {
        "voice": "ar-EG-SalmaNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "description": "نبرة طبيعية محايدة — صوت أنثوي مصري هادي",
    },
    "enthusiastic": {
        "voice": "ar-EG-ShakirNeural",
        "rate": "+15%",
        "pitch": "+10Hz",
        "description": "نبرة حماسية — صوت ذكوري مصري سريع وحيوي",
    },
    "confident": {
        "voice": "ar-SA-HamedNeural",
        "rate": "-5%",
        "pitch": "-5Hz",
        "description": "نبرة واثقة هادية — صوت ذكوري سعودي رزين",
    },
    "sad": {
        "voice": "ar-EG-SalmaNeural",
        "rate": "-20%",
        "pitch": "-15Hz",
        "description": "نبرة حزينة — صوت أنثوي مصري بطيء ومنخفض",
    },
    "angry": {
        "voice": "ar-EG-ShakirNeural",
        "rate": "+25%",
        "pitch": "+20Hz",
        "description": "نبرة غاضبة — صوت ذكوري مصري سريع وعالي",
    },
}

def get_voice_profile(emotion="neutral"):
    """بيرجع voice profile حسب العاطفة."""
    return VOICE_PROFILES.get(emotion, VOICE_PROFILES["neutral"])

def list_emotions():
    """بيرجع قائمة العواطف المتاحة."""
    return list(VOICE_PROFILES.keys())

if __name__ == "__main__":
    for emotion, profile in VOICE_PROFILES.items():
        print(f"  {emotion}: {profile['voice']} | rate={profile['rate']} | {profile['description']}")
