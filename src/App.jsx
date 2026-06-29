import { useRef, useState } from "react";

import { useChildren } from "./hooks/useChildren";
import { usePosts } from "./hooks/usePosts";
import { preparePhotoForStorage } from "./services/photoService";
import { DEFAULT_COMPOSITION } from "./utils/helpers";

import TopNav from "./components/TopNav";
import BottomTabs, { TAB_LIST } from "./components/BottomTabs";
import Drawer from "./components/Drawer";
import FramePicker from "./components/FramePicker";
import ChildPicker from "./components/ChildPicker";
import AddChildSheet from "./components/AddChildSheet";
import CommentsSheet from "./components/CommentsSheet";
import PostOptionsSheet from "./components/PostOptionsSheet";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import SharesScreen from "./screens/SharesScreen";
import ChildrenScreen from "./screens/ChildrenScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ChildDetailScreen from "./screens/ChildDetailScreen";
import NotificationsScreen from "./screens/NotificationsScreen";

const ALL_SCREENS = ["home", "shares", "children", "profile", "child-detail", "notifications"];

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screenHistory, setScreenHistory] = useState(["home"]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [framePickerOpen, setFramePickerOpen] = useState(false);
  const [childPickerOpen, setChildPickerOpen] = useState(false);
  const [addChildOpen, setAddChildOpen] = useState(false);
  const [pendingImageURL, setPendingImageURL] = useState(null);
  const [pendingFrameURL, setPendingFrameURL] = useState("");
  const [pendingComposition, setPendingComposition] = useState(DEFAULT_COMPOSITION);
  const [activeChildName, setActiveChildName] = useState("");
  const [commentsPostId, setCommentsPostId] = useState(null);
  const [optionsPostId, setOptionsPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const photoInputRef = useRef(null);

  const { childrenList, addChild } = useChildren();
  const { posts, createPost, toggleLike, addComment, updatePostFrame, deletePost } = usePosts();

  const activeScreen = screenHistory[screenHistory.length - 1];
  const homeState = childrenList.length === 0 ? "no-child" : posts.length === 0 ? "no-album" : "feed";
  const commentsPost = posts.find((p) => p.id === commentsPostId) || null;
  const optionsPost = posts.find((p) => p.id === optionsPostId) || null;
  const editingPost = posts.find((p) => p.id === editingPostId) || null;

  const push = (name) => setScreenHistory((h) => [...h, name]);
  const goBack = () => setScreenHistory((h) => (h.length > 1 ? h.slice(0, -1) : ["home"]));
  const showTab = (name) => setScreenHistory([name]);

  const openPhotoPicker = () => {
    if (childrenList.length === 0) { push("children"); return; }
    photoInputRef.current.value = "";
    photoInputRef.current.click();
  };

  const handlePhotoSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imageURL = await preparePhotoForStorage(file);
      setPendingImageURL(imageURL);
      setPendingComposition(DEFAULT_COMPOSITION);
      setFramePickerOpen(true);
    } catch {
      alert("Fotoğraf yüklenemedi. Lütfen başka bir fotoğraf deneyin.");
    }
  };

  const handleFrameConfirm = (frameURL, composition) => {
    if (editingPostId) {
      updatePostFrame(editingPostId, frameURL, composition);
      setEditingPostId(null);
      setFramePickerOpen(false);
      return;
    }
    setPendingFrameURL(frameURL);
    setPendingComposition(composition);
    setFramePickerOpen(false);
    if (childrenList.length === 1) {
      createPost(childrenList[0].name, pendingImageURL, frameURL, composition);
      showTab("home");
    } else {
      setChildPickerOpen(true);
    }
  };

  const handleChildPicked = (name) => {
    setChildPickerOpen(false);
    createPost(name, pendingImageURL, pendingFrameURL, pendingComposition);
    showTab("home");
  };

  const handleEditFrame = (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    setOptionsPostId(null);
    setEditingPostId(postId);
    setPendingImageURL(post.imageURL);
    setPendingFrameURL(post.frameURL || "");
    setPendingComposition(post.composition || DEFAULT_COMPOSITION);
    setFramePickerOpen(true);
  };

  const handleDeletePost = (postId) => {
    deletePost(postId);
    if (commentsPostId === postId) setCommentsPostId(null);
    if (editingPostId === postId) setEditingPostId(null);
    setOptionsPostId(null);
  };

  if (!loggedIn) {
    return (
      <div className="phone">
        <LoginScreen onLogin={() => setLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div className="phone">
      <TopNav
        screen={activeScreen}
        childName={activeChildName}
        canGoBack={screenHistory.length > 1}
        onBack={goBack}
        onAdd={openPhotoPicker}
        onNotifications={() => push("notifications")}
        onMenu={() => setDrawerOpen(true)}
      />
      <main>
        {ALL_SCREENS.map((name) => (
          <section key={name} className={`screen${activeScreen === name ? " active" : ""}`} data-screen={name}>
            {name === "home" && <HomeScreen homeState={homeState} posts={posts} onAddChild={() => setAddChildOpen(true)} onAddMemory={openPhotoPicker} onToggleLike={toggleLike} onOpenComments={setCommentsPostId} onOpenOptions={setOptionsPostId} />}
            {name === "shares" && <SharesScreen posts={posts} onOpenChild={(child) => { setActiveChildName(child); push("child-detail"); }} />}
            {name === "children" && <ChildrenScreen childrenList={childrenList} posts={posts} onAddChild={() => setAddChildOpen(true)} onChildTap={(child) => { setActiveChildName(child.name); push("child-detail"); }} />}
            {name === "profile" && <ProfileScreen onLogout={() => setLoggedIn(false)} />}
            {name === "child-detail" && <ChildDetailScreen childName={activeChildName} posts={posts} onAddMemory={openPhotoPicker} onOpenOptions={setOptionsPostId} />}
            {name === "notifications" && <NotificationsScreen />}
          </section>
        ))}
      </main>
      <BottomTabs active={TAB_LIST.includes(activeScreen) ? activeScreen : ""} onChange={push} />

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <FramePicker
        open={framePickerOpen}
        imageURL={pendingImageURL}
        initialFrameURL={editingPost ? editingPost.frameURL || "" : ""}
        initialComposition={editingPost ? editingPost.composition || DEFAULT_COMPOSITION : DEFAULT_COMPOSITION}
        onConfirm={handleFrameConfirm}
        onClose={() => { setFramePickerOpen(false); setEditingPostId(null); }}
      />
      <ChildPicker
        open={childPickerOpen}
        childrenList={childrenList}
        onSelect={handleChildPicked}
        onClose={() => setChildPickerOpen(false)}
      />
      <AddChildSheet open={addChildOpen} onClose={() => setAddChildOpen(false)} onAdd={addChild} />
      <CommentsSheet post={commentsPost} open={Boolean(commentsPost)} onClose={() => setCommentsPostId(null)} onAddComment={addComment} />
      <PostOptionsSheet post={optionsPost} open={Boolean(optionsPost)} onClose={() => setOptionsPostId(null)} onEditFrame={handleEditFrame} onDelete={handleDeletePost} />
      <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoSelected} />
    </div>
  );
}
