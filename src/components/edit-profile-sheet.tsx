
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type UserProfile } from "@/app/profile/page";

interface EditProfileSheetProps {
  children: React.ReactNode;
  user: UserProfile;
  onProfileUpdate: (newProfile: UserProfile) => void;
}

export function EditProfileSheet({ children, user, onProfileUpdate }: EditProfileSheetProps) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [pictureFile, setPictureFile] = useState<File | null>(null);

  useEffect(() => {
    setName(user.name);
    setBio(user.bio);
    setProfilePicture(user.profilePicture);
  }, [user]);

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPictureFile(file);
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = () => {
    onProfileUpdate({
      name,
      bio,
      profilePicture: pictureFile ? URL.createObjectURL(pictureFile) : user.profilePicture,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="col-span-3"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right">
              Profile Picture
            </Label>
             <Input 
               id="picture" 
               type="file"
               accept="image/*"
               onChange={handlePictureChange}
               className="col-span-3" 
             />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
