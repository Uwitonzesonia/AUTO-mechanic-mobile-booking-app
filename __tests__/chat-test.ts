jest.mock("firebase/firestore", () => ({
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    addDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    onSnapshot: jest.fn(),
    serverTimestamp: jest.fn(),
    limit: jest.fn(),
    writeBatch: jest.fn(),
    Timestamp: {
        now: jest.fn(),
        fromDate: (d: any) => d,
    },
}));

jest.mock("@/config/firebaseConfig", () => ({
    db: {},
    auth: {},
    app: {},
}));

import {
    buildChatId,
    parseDate,
    formatMessageTime,
    getAvailableMechanics,
} from "@/services/chatService";

describe("Chat Service", () => {
    describe("buildChatId", () => {
        it("should generate deterministic IDs regardless of argument order", () => {
            const id1 = buildChatId("user_abc", "mechanic_xyz");
            const id2 = buildChatId("mechanic_xyz", "user_abc");
            expect(id1).toBe(id2);
            expect(id1).toBe("mechanic_xyz_user_abc");
        });

        it("should trim whitespace from user IDs", () => {
            const id = buildChatId("  user_1  ", "user_2 ");
            expect(id).toBe("user_1_user_2");
        });
    });

    describe("parseDate", () => {
        it("should parse Date object", () => {
            const now = new Date();
            expect(parseDate(now)).toEqual(now);
        });

        it("should parse number timestamp", () => {
            const time = 1710000000000;
            expect(parseDate(time).getTime()).toBe(time);
        });

        it("should parse Firestore-like Timestamp object", () => {
            const fakeTimestamp = {
                toDate: () => new Date("2026-03-15T12:00:00Z"),
            };
            expect(parseDate(fakeTimestamp)).toEqual(new Date("2026-03-15T12:00:00Z"));
        });

        it("should parse ISO date strings", () => {
            const iso = "2026-03-15T12:00:00.000Z";
            expect(parseDate(iso).toISOString()).toBe(iso);
        });

        it("should fallback gracefully for null or invalid inputs", () => {
            expect(parseDate(null)).toBeInstanceOf(Date);
            expect(parseDate("invalid-date-string")).toBeInstanceOf(Date);
        });
    });

    describe("formatMessageTime", () => {
        it("should format a timestamp correctly", () => {
            const now = new Date();
            const formatted = formatMessageTime(now);
            expect(typeof formatted).toBe("string");
            expect(formatted.length).toBeGreaterThan(0);
        });

        it("should indicate Yesterday for past day", () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const formatted = formatMessageTime(yesterday);
            expect(formatted).toContain("Yesterday");
        });
    });

    describe("getAvailableMechanics", () => {
        it("should return catalog mechanics", async () => {
            const mechanics = await getAvailableMechanics();
            expect(mechanics.length).toBeGreaterThan(0);
            expect(mechanics[0]).toHaveProperty("id");
            expect(mechanics[0]).toHaveProperty("name");
            expect(mechanics[0].role).toBe("mechanic");
        });

        it("should filter mechanics based on search query", async () => {
            const mechanics = await getAvailableMechanics("Joe");
            expect(mechanics.some((m) => m.name.includes("Joe"))).toBe(true);
        });

        it("should filter mechanics based on expertise", async () => {
            const mechanics = await getAvailableMechanics("Tesla");
            expect(mechanics.some((m) => m.expertise?.includes("Tesla"))).toBe(true);
        });
    });
});
