import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { useNotifications } from "@/contexts/NotificationContext";
import AppIcon from "@/utils/AppIcon";

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: "order" | "promo" | "system";
}
const NotificationScreen: React.FC = () => {
  const {
    notifications,
    unreadCount,
    hasPermission,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    requestPermissions,
  } = useNotifications();

  const handleRequestPermissions = async () => {
    const granted = await requestPermissions();
    if (granted) {
      Alert.alert("Succès", "Permissions accordées !");
    } else {
      Alert.alert("Erreur", "Permissions refusées");
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return "receipt-outline";
      case "promo":
        return "pricetag-outline";
      default:
        return "information-circle-outline";
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <AppIcon
            name={getNotificationIcon(item.type)}
            size={24}
            color={item.read ? "#666" : "#007AFF"}
          />
          <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
          <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
        </View>
        <Text style={[styles.body, !item.read && styles.unreadBody]}>{item.body}</Text>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Text style={styles.unreadCount}>
          {unreadCount} non lue{unreadCount !== 1 ? "s" : ""}
        </Text>
      </View>

      {!hasPermission && (
        <View style={styles.permissionBanner}>
          <Text style={styles.permissionText}>Activez les notifications pour rester informé</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={handleRequestPermissions}>
            <Text style={styles.permissionButtonText}>Activer</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <Text style={[styles.actionButtonText, unreadCount === 0 && styles.disabledText]}>
            Tout marquer comme lu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            Alert.alert(
              "Effacer toutes les notifications",
              "Êtes-vous sûr de vouloir supprimer toutes les notifications ?",
              [
                { text: "Annuler", style: "cancel" },
                { text: "Confirmer", onPress: clearNotifications },
              ],
            );
          }}
        >
          <Text style={styles.actionButtonText}>Effacer tout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <AppIcon name="notifications-off-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>Aucune notification</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#FFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  unreadCount: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  permissionBanner: {
    backgroundColor: "#FFF3CD",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  permissionText: {
    flex: 1,
    fontSize: 14,
    color: "#856404",
  },
  permissionButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  permissionButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    backgroundColor: "#FFF",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  disabledText: {
    color: "#CCC",
  },
  list: {
    flex: 1,
  },
  notificationItem: {
    backgroundColor: "#FFF",
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  notificationContent: {
    position: "relative",
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    flex: 1,
    marginLeft: 12,
  },
  unreadTitle: {
    color: "#333",
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  body: {
    fontSize: 14,
    color: "#888",
    lineHeight: 20,
  },
  unreadBody: {
    color: "#555",
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 16,
  },
});

export default NotificationScreen;
