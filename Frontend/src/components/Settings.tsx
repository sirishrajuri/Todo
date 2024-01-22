import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import { AppSettings } from "../types/user";
import { DialogBtn } from "../styles";
import styled from "@emotion/styled";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { CachedRounded, VolumeDown, VolumeOff, VolumeUp, WifiOff } from "@mui/icons-material";
import { defaultUser } from "../constants/defaultUser";
import { UserContext } from "../contexts/UserContext";
import { iOS } from "../utils/iOS";

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: SettingsProps) => {
  const { user, setUser } = useContext(UserContext);
  const [settings, setSettings] = useState<AppSettings>(user.settings[0]);
  const [lastStyle] = useState<EmojiStyle>(user.emojisStyle);

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceVolume, setVoiceVolume] = useState<number>(user.settings[0].voiceVolume);
  const [prevVoiceVol, setPrevVoiceVol] = useState<number>(user.settings[0].voiceVolume);

  const emojiStyles: { label: string; style: EmojiStyle }[] = [
    { label: "Apple", style: EmojiStyle.APPLE },
    { label: "Facebook, Messenger", style: EmojiStyle.FACEBOOK },
    { label: "Twitter, Discord", style: EmojiStyle.TWITTER },
    { label: "Google", style: EmojiStyle.GOOGLE },
    { label: "Native", style: EmojiStyle.NATIVE },
  ];

  const getAvailableVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    const voiceInfoArray = [];
    console.log(voices);

    for (const voice of voices) {
      voiceInfoArray.push(voice);
    }

    return voiceInfoArray;
  };

  useEffect(() => {
    const availableVoices = getAvailableVoices();
    setAvailableVoices(availableVoices ?? []);
  }, []);

  window.speechSynthesis.onvoiceschanged = () => {
    const availableVoices = getAvailableVoices();
    setAvailableVoices(availableVoices ?? []);
  };

  const handleSettingChange =
    (name: keyof AppSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedSettings = {
        ...settings,
      };
      setSettings(updatedSettings);
      setUser((prevUser) => ({
        ...prevUser,
        settings: [updatedSettings],
      }));
    };

  const handleEmojiStyleChange = (event: SelectChangeEvent<unknown>) => {
    const selectedEmojiStyle = event.target.value as EmojiStyle;
    setUser((prevUser) => ({
      ...prevUser,
      emojisStyle: selectedEmojiStyle,
    }));
  };
  const handleVoiceChange = (event: SelectChangeEvent<unknown>) => {
    const selectedVoice = availableVoices.find((voice) => voice.name === event.target.value);

    if (selectedVoice) {
      console.log("Selected Voice:", selectedVoice);
      setUser((prevUser) => ({
        ...prevUser,
        settings: [
          {
            ...prevUser.settings[0],
            voice: selectedVoice.name,
          },
        ],
      }));
    }
  };
  const handleVoiceVolChange = (e: Event, value: number | number[]) => {
    e.preventDefault();
    setVoiceVolume(value as number);
    setUser((prevUser) => ({
      ...prevUser,
      settings: [
        {
          ...prevUser.settings[0],
          voiceVolume: value as number,
        },
      ],
    }));
  };

  const handleMuteClick = () => {
    const vol = voiceVolume;

    setPrevVoiceVol(vol);

    const newVoiceVolume =
      vol === 0 ? (prevVoiceVol !== 0 ? prevVoiceVol : defaultUser.settings[0].voiceVolume) : 0;

    setUser((prevUser) => ({
      ...prevUser,
      settings: [
        {
          ...prevUser.settings[0],
          voiceVolume: newVoiceVolume,
        },
      ],
    }));
    setVoiceVolume(newVoiceVolume);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "24px",
          padding: "12px",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Settings</DialogTitle>
      <Container>
        {}
        <FormGroup>
          <FormControl>
            <FormLabel>Emoji Settings</FormLabel>
            <StyledSelect value={user.emojisStyle} onChange={handleEmojiStyleChange} translate="no">
              {}
              {(
                <MenuItem
                  disabled
                  style={{
                    opacity: 0.8,
                    display: "flex",
                    gap: "6px",
                    fontWeight: 500,
                  }}
                >
                  <WifiOff /> You can't change the emoji style <br /> when you are offline
                </MenuItem>
              )}

              {emojiStyles.map((style) => (
                <MenuItem
                  key={style.style}
                  value={style.style}
                  translate="no"
                  disabled={
                    style.style !== EmojiStyle.NATIVE &&
                    style.style !== defaultUser.emojisStyle &&
                    style.style !== lastStyle
                  }
                  sx={{
                    padding: "12px 20px",
                    borderRadius: "12px",
                    margin: "8px",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <Emoji size={24} unified="1f60e" emojiStyle={style.style} />
                  &nbsp;
                  {}
                  {style.style === EmojiStyle.NATIVE && "\u00A0"}
                  {style.label}
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        </FormGroup>

        {}
        <FormGroup>
          <FormLabel>App Settings</FormLabel>
          <FormControlLabel
            sx={{ opacity: settings.enableCategories ? 1 : 0.8 }}
            control={
              <Switch
                checked={settings.enableCategories}
                onChange={handleSettingChange("enableCategories")}
              />
            }
            label="Enable Categories"
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            sx={{ opacity: settings.enableGlow ? 1 : 0.8 }}
            control={
              <Switch checked={settings.enableGlow} onChange={handleSettingChange("enableGlow")} />
            }
            label="Enable Glow Effect"
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            sx={{ opacity: settings.doneToBottom ? 1 : 0.8 }}
            control={
              <Switch
                checked={settings.doneToBottom}
                onChange={handleSettingChange("doneToBottom")}
              />
            }
            label="Move Done Tasks To Bottom"
          />
        </FormGroup>

        
      </Container>
      <DialogActions>
        <DialogBtn onClick={onClose}>Close</DialogBtn>
      </DialogActions>
    </Dialog>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: left;
  align-items: left;
  flex-direction: column;
  user-select: none;
  margin: 0 18px;
  gap: 6px;
`;

const StyledSelect = styled(Select)`
  width: 300px;
  color: black;
  margin: 8px 0;
`;

const NoVoiceStyles = styled.p`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 6px;
  opacity: 0.8;
  font-weight: 500;
  max-width: 300px;
`;

const VolumeSlider = styled(Stack)`
  margin: 8px 0;
  background: #afafaf39;
  padding: 12px 24px 12px 18px;
  border-radius: 18px;
  transition: 0.3s all;
  &:hover {
    background: #89898939;
  }
`;
